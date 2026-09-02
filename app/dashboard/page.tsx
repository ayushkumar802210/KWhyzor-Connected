import { RealBillPrompt } from '../components/real-bill-state';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <RealBillPrompt mode="dashboard" />;
  }

  const { data: verifiedBills } = await supabase
    .from('electricity_bills')
    .select('id, provider, bill_date, due_date, units_kwh, total_payable')
    .eq('user_id', user.id)
    .eq('verification_status', 'verified');

  return <RealBillPrompt mode="dashboard" verifiedBillCount={verifiedBills?.length ?? 0} latestBill={verifiedBills?.[0] ?? null} />;
}
