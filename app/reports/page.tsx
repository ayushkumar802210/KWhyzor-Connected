const reportSummary = [
  { label: 'Billing period', value: 'Not available' },
  { label: 'Units', value: 'Not available' },
  { label: 'Amount', value: 'Not available' },
  { label: 'Previous comparison', value: 'Not available' }
];

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-5xl">
        <div className="mb-8">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Reports</div>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Monthly electricity report</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reportSummary.map((item) => (
            <div key={item.label} className="card-surface p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</div>
              <div className="mt-4 text-xl font-black text-slate-900">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-lg font-black text-slate-900">No verified data yet.</div>
          <p className="mt-2 text-sm text-slate-600">Upload a real bill to generate an actual monthly electricity report.</p>
        </div>
      </div>
    </main>
  );
}
