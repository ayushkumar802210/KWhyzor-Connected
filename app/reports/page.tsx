import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: bills } = user
    ? await supabase.from('electricity_bills').select('id, provider, bill_date, units_kwh, total_payable, verification_status').eq('user_id', user.id).eq('verification_status', 'verified').order('bill_date', { ascending: false })
    : { data: [] };
  const latestBill = bills?.[0];

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-5xl">
        <div className="mb-8">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Reports</div>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Monthly electricity report</h1>
        </div>

        {!latestBill ? <div className="card-surface p-8"><div className="text-xl font-black text-slate-900">Not enough verified electricity data to generate this report.</div><p className="mt-2 text-sm text-slate-600">Upload a real bill and verify its extracted fields, or enter actual bill details manually.</p></div> : <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ReportValue label="Provider" value={latestBill.provider ?? 'Not identified'} source="USER_PROVIDED or ACTUAL_FROM_BILL" />
            <ReportValue label="Billing date" value={latestBill.bill_date ?? 'Not available'} source="Evidence required" />
            <ReportValue label="Units" value={latestBill.units_kwh === null ? 'Not available' : `${latestBill.units_kwh} kWh`} source="Evidence preserved in bill fields" />
            <ReportValue label="Amount" value={latestBill.total_payable === null ? 'Not available' : `₹${latestBill.total_payable}`} source="Evidence preserved in bill fields" />
          </div>
          <div className="mt-8 card-surface p-6"><h2 className="text-lg font-black text-slate-900">Verified bill report</h2><p className="mt-2 text-sm text-slate-600">This report contains {bills?.length ?? 0} verified bill record{bills?.length === 1 ? '' : 's'}. Missing months and missing fields are left unavailable.</p><div className="mt-5 space-y-2">{bills?.map((bill) => <div key={bill.id} className="flex flex-wrap justify-between gap-2 rounded-xl border border-slate-200 p-3 text-sm"><span>{bill.bill_date ?? 'Date not available'}</span><span>{bill.units_kwh === null ? 'Units not available' : `${bill.units_kwh} kWh`}</span><span>{bill.total_payable === null ? 'Amount not available' : `₹${bill.total_payable}`}</span><span className="text-emerald-700">VERIFIED</span></div>)}</div></div>
        </>}
      </div>
    </main>
  );
}

function ReportValue({ label, value, source }: { label: string; value: string; source: string }) {
  return <div className="card-surface p-5"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div><div className="mt-4 text-xl font-black text-slate-900">{value}</div><div className="mt-2 text-xs text-slate-500">{source}</div></div>;
}
