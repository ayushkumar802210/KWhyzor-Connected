import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';
import { analyzeWithAzureDocumentIntelligence } from '@/lib/ocr/azure-document-intelligence';

function extractFields(rawText: string) {
  const find = (pattern: RegExp) => rawText.match(pattern)?.[1]?.trim() ?? null;
  const provider = find(/(?:electricity board|power corporation|distribution company|discom)\s*[:\-]?\s*([^\n]+)/i);
  const consumerNumber = find(/(?:consumer|account|customer)\s*(?:no|number|id)?\s*[:\-]?\s*([A-Z0-9\-/]+)/i);
  const meterNumber = find(/meter\s*(?:no|number|id)?\s*[:\-]?\s*([A-Z0-9\-/]+)/i);
  const billNumber = find(/bill\s*(?:no|number)\s*[:\-]?\s*([A-Z0-9\-/]+)/i);
  const units = find(/(?:units|consumption|energy consumed)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:kwh|units)?/i);
  const amount = find(/(?:total payable|amount payable|total amount)\s*[:\-]?\s*(?:₹|rs\.?|inr)?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i);
  return { provider, consumerNumber, meterNumber, billNumber, unitsKwh: units ? Number(units) : null, totalPayable: amount ? Number(amount.replace(/,/g, '')) : null };
}

const signatures: Record<string, (bytes: Uint8Array) => boolean> = {
  'application/pdf': (bytes) => new TextDecoder().decode(bytes.slice(0, 4)) === '%PDF',
  'image/jpeg': (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  'image/png': (bytes) => bytes.slice(0, 8).every((byte, index) => byte === [137, 80, 78, 71, 13, 10, 26, 10][index]),
  'image/webp': (bytes) => new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP'
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return Response.json({ error: 'No file provided.' }, { status: 400 });
  }

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
  const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some((ext) => fileName.endsWith(`.${ext}`));

  if (!hasValidExtension || !allowedTypes.includes(file.type)) {
    return Response.json({ error: 'Unsupported file type.' }, { status: 415 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return Response.json({ error: 'File exceeds the maximum supported size.' }, { status: 413 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!signatures[file.type]?.(bytes)) {
    return Response.json({ error: 'The file signature does not match its declared type.' }, { status: 415 });
  }

  const uploadId = randomUUID();
  const storagePath = `${user.id}/${uploadId}/original-file`;
  const { error: storageError } = await supabase.storage.from('electricity-bills').upload(storagePath, bytes, {
    contentType: file.type,
    upsert: false
  });

  if (storageError) {
    return Response.json({ error: 'The bill could not be stored securely.' }, { status: 502 });
  }

  const { error: documentError } = await supabase.from('bill_documents').insert({
    id: uploadId,
    user_id: user.id,
    storage_path: storagePath,
    original_filename: file.name,
    mime_type: file.type,
    size_bytes: file.size,
    processing_status: env.OCR_PROVIDER === 'azure' && env.OCR_API_KEY && env.OCR_ENDPOINT ? 'processing' : 'not_configured'
  });

  if (documentError) {
    await supabase.storage.from('electricity-bills').remove([storagePath]);
    return Response.json({ error: 'The bill record could not be created.' }, { status: 500 });
  }

  const { error: billError } = await supabase.from('electricity_bills').insert({
    user_id: user.id,
    document_id: uploadId,
    verification_status: 'review_required'
  });
  if (billError) {
    await supabase.storage.from('electricity-bills').remove([storagePath]);
    return Response.json({ error: 'The bill review record could not be created.' }, { status: 500 });
  }

  if (env.OCR_PROVIDER !== 'azure' || !env.OCR_API_KEY || !env.OCR_ENDPOINT) {
    return Response.json({ ok: false, status: 'not_configured', documentId: uploadId, message: 'Bill scanning is not configured yet. Please configure the OCR service or enter bill details manually.' }, { status: 503 });
  }

  try {
    const rawText = await analyzeWithAzureDocumentIntelligence(bytes, file.type);
    const fields = extractFields(rawText);
    const { error: extractionError } = await supabase.from('bill_extractions').insert({ document_id: uploadId, raw_ocr_text: rawText, provider_evidence: fields.provider, extraction_data: fields });
    if (extractionError) throw new Error('EXTRACTION_SAVE_FAILED');
    await supabase.from('bill_documents').update({ processing_status: 'review_required' }).eq('id', uploadId).eq('user_id', user.id);
    const { data: reviewBill } = await supabase.from('electricity_bills').select('id').eq('document_id', uploadId).eq('user_id', user.id).single();
    if (reviewBill) await supabase.from('bill_verification_events').insert({ bill_id: reviewBill.id, user_id: user.id, event_type: 'processed', event_data: { source: 'azure-document-intelligence' } });
    return Response.json({ ok: true, status: 'review_required', documentId: uploadId, message: 'Bill processed. Review the extracted fields before verification.' });
  } catch (error) {
    console.error('Bill OCR processing failed', error instanceof Error ? error.message : 'unknown error');
    await supabase.from('bill_documents').update({ processing_status: 'ocr_failed' }).eq('id', uploadId).eq('user_id', user.id);
    return Response.json({ ok: false, status: 'ocr_failed', documentId: uploadId, message: 'Bill scanning failed. Please try again or enter the bill details manually.' }, { status: 502 });
  }
}
