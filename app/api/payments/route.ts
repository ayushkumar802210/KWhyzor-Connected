import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401 });
  const { data, error } = await supabase.from('payments').select('id, order_id, payment_id, amount, currency, gateway, status, webhook_verified, created_at, updated_at').eq('user_id', user.id).order('created_at', { ascending: false });
  if (error) return Response.json({ error: 'Payment history is unavailable.' }, { status: 500 });
  return Response.json({ payments: data });
}
