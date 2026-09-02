import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const reviewSchema = z.object({
  decision: z.enum(['verify', 'reject']).default('verify'),
  provider: z.string().trim().max(200).optional(),
  consumerNumber: z.string().trim().max(120).optional(),
  meterNumber: z.string().trim().max(120).optional(),
  billNumber: z.string().trim().max(120).optional(),
  billDate: z.string().date().optional(),
  dueDate: z.string().date().optional(),
  unitsKwh: z.coerce.number().finite().nonnegative().optional(),
  totalPayable: z.coerce.number().finite().nonnegative().optional()
});

export async function POST(request: Request, { params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401 });
  const parsed = reviewSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: 'Review fields are invalid.' }, { status: 400 });
  const input = parsed.data;
  const { data: bill } = await supabase.from('electricity_bills').select('id, verification_status').eq('document_id', documentId).eq('user_id', user.id).single();
  if (!bill) return Response.json({ error: 'Bill review was not found.' }, { status: 404 });
  if (bill.verification_status === 'verified') return Response.json({ error: 'This bill is already verified.' }, { status: 409 });
  const { decision, ...billFields } = input;
  if (decision === 'reject') {
    await supabase.from('bill_documents').update({ processing_status: 'rejected' }).eq('id', documentId).eq('user_id', user.id);
    await supabase.from('bill_verification_events').insert({ bill_id: bill.id, user_id: user.id, event_type: 'rejected', event_data: { reason: 'Rejected during user review.' } });
    return Response.json({ ok: true, status: 'rejected', billId: bill.id });
  }

  const hasData = Object.values(billFields).some((value) => value !== undefined && value !== '');
  if (!hasData) return Response.json({ error: 'At least one extracted or corrected bill field is required.' }, { status: 400 });

  const { error: updateError } = await supabase.from('electricity_bills').update({
    provider: input.provider || null, consumer_number: input.consumerNumber || null, meter_number: input.meterNumber || null,
    bill_number: input.billNumber || null, bill_date: input.billDate || null, due_date: input.dueDate || null,
    units_kwh: input.unitsKwh ?? null, total_payable: input.totalPayable ?? null,
    verification_status: 'verified', verified_at: new Date().toISOString()
  }).eq('id', bill.id).eq('user_id', user.id);
  if (updateError) return Response.json({ error: 'Bill could not be verified.' }, { status: 500 });

  const fields = Object.entries(billFields).filter(([, value]) => value !== undefined && value !== '').map(([fieldName, value]) => ({ bill_id: bill.id, user_id: user.id, field_name: fieldName, value_text: typeof value === 'string' ? value : null, value_numeric: typeof value === 'number' ? value : null, source: 'USER_PROVIDED', confidence: 'user-confirmed', evidence: 'Confirmed or corrected by the user during bill review.' }));
  if (fields.length) await supabase.from('bill_field_values').insert(fields);
  await supabase.from('bill_verification_events').insert({ bill_id: bill.id, user_id: user.id, event_type: 'verified', event_data: { confirmed_fields: Object.keys(billFields) } });
  return Response.json({ ok: true, status: 'verified', billId: bill.id });
}
