import { RealBillPrompt } from '../components/real-bill-state';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function BillDetectivePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <RealBillPrompt mode="detective" />;
  const { data } = await supabase.from('electricity_bills').select('id').eq('user_id', user.id).eq('verification_status', 'verified');
  return <RealBillPrompt mode="detective" verifiedBillCount={data?.length ?? 0} />;
}
