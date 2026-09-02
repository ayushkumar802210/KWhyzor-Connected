import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ReviewForm } from './review-form';

export const dynamic = 'force-dynamic';

export default async function BillReviewPage({ params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <main className="p-8">Authentication required.</main>;
  const { data: document } = await supabase.from('bill_documents').select('id, original_filename, processing_status, created_at').eq('id', documentId).eq('user_id', user.id).single();
  if (!document) notFound();
  const { data: extraction } = await supabase.from('bill_extractions').select('raw_ocr_text, extraction_data, provider_evidence').eq('document_id', document.id).single();

  const extractedFields = extraction?.extraction_data as Record<string, unknown> | undefined;
  return <main className="min-h-screen bg-slate-100 p-6"><div className="container-shell max-w-4xl"><div className="card-surface p-8"><div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Bill review</div><h1 className="mt-2 text-3xl font-black text-slate-900">Review before verification</h1><p className="mt-3 text-slate-600">{document.original_filename}</p><div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="font-bold text-slate-900">Status: {document.processing_status}</div><p className="mt-2 text-sm text-slate-600">{extraction ? 'Extracted fields are available for review. Values remain unverified until you confirm them.' : 'No extracted fields are available. Nothing has been marked verified.'}</p></div>{extraction ? <><ReviewForm documentId={document.id} fields={{ provider: String(extractedFields?.provider ?? ''), consumerNumber: String(extractedFields?.consumerNumber ?? ''), meterNumber: String(extractedFields?.meterNumber ?? ''), billNumber: String(extractedFields?.billNumber ?? ''), unitsKwh: typeof extractedFields?.unitsKwh === 'number' ? extractedFields.unitsKwh : null, totalPayable: typeof extractedFields?.totalPayable === 'number' ? extractedFields.totalPayable : null }} /><details className="mt-6"><summary className="cursor-pointer text-sm font-semibold text-slate-700">View raw OCR evidence</summary><pre className="mt-3 overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100">{extraction.raw_ocr_text || 'No raw OCR text available.'}</pre></details></> : <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Bill scanning is not configured yet. Please configure the OCR service or enter your bill details manually.</p>}</div></div></main>;
}