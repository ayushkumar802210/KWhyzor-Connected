const causes = [
  { label: 'Higher consumption', value: 'Evidence required', status: 'Needs verification' },
  { label: 'Longer billing period', value: 'Check billing days', status: 'Needs verification' },
  { label: 'Tariff or slab change', value: 'Requires bill evidence', status: 'Needs verification' },
  { label: 'Fixed or demand charge change', value: 'Check bill line items', status: 'Needs verification' },
  { label: 'Taxes or surcharge change', value: 'May be shown on bill', status: 'Needs verification' },
  { label: 'Arrears or late fee', value: 'Must be explicitly present', status: 'Needs verification' }
];

export default function BillDetectivePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-5xl">
        <div className="card-surface p-8">
          <div className="mb-6">
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Bill Detective</div>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Why did my electricity bill increase?</h1>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm text-slate-600">This analysis uses only the evidence available on the uploaded bill and verified consumption history.</div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {causes.map((cause) => (
              <div key={cause.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-lg font-black text-slate-900">{cause.label}</div>
                <div className="mt-2 text-sm text-slate-600">{cause.value}</div>
                <div className="mt-3 inline-flex rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">{cause.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
