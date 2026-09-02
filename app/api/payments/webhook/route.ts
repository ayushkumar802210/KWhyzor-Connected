import { createHmac, timingSafeEqual } from 'crypto';
import { env } from '@/lib/env';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  if (env.PAYMENT_PROVIDER !== 'razorpay' || !env.PAYMENT_WEBHOOK_SECRET) return Response.json({ error: 'Payment gateway is not configured.' }, { status: 503 });
  const signature = request.headers.get('x-razorpay-signature');
  const body = await request.text();
  if (!signature) return Response.json({ error: 'Missing webhook signature.' }, { status: 400 });
  const expected = createHmac('sha256', env.PAYMENT_WEBHOOK_SECRET).update(body).digest('hex');
  const valid = signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return Response.json({ error: 'Invalid webhook signature.' }, { status: 401 });
  let payload: { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string; status?: string } } } };
  try {
    payload = JSON.parse(body) as typeof payload;
  } catch {
    return Response.json({ error: 'Invalid webhook payload.' }, { status: 400 });
  }
  const entity = payload.payload?.payment?.entity;
  if (!entity?.order_id) return Response.json({ received: true });
  const status = payload.event === 'payment.captured' || entity.status === 'captured' ? 'paid' : payload.event === 'payment.failed' ? 'failed' : null;
  if (!status) return Response.json({ received: true });
  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return Response.json({ error: 'Payment database is not configured.' }, { status: 503 });
  }
  const { data: payment, error } = await supabase.from('payments').update({ payment_id: entity.id || null, status, webhook_verified: true, provider_response: payload, updated_at: new Date().toISOString() }).eq('order_id', entity.order_id).neq('webhook_verified', true).select('user_id').maybeSingle();
  if (error) return Response.json({ error: 'Payment status could not be recorded.' }, { status: 500 });
  if (payment && status === 'paid') {
    const notes = (payload.payload?.payment?.entity as { notes?: { plan?: string } } | undefined)?.notes;
    if (notes?.plan) await supabase.from('subscriptions').upsert({ user_id: payment.user_id, plan: notes.plan, status: 'active', gateway: 'razorpay', updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  }
  return Response.json({ received: true });
}
