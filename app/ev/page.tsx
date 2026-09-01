const evInputs = [
  { label: 'Daily kilometres', value: 'Not configured' },
  { label: 'EV efficiency', value: 'Not configured' },
  { label: 'Charging frequency', value: 'Not configured' },
  { label: 'Estimated monthly EV energy', value: 'Not configured' }
];

export default function EVPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-5xl">
        <div className="card-surface p-8">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">EV analysis</div>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Estimated electric vehicle energy use</h1>
          <p className="mt-3 text-slate-600">These values are estimates based on user-entered assumptions and are clearly marked as such.</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {evInputs.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</div>
                <div className="mt-2 text-xl font-black text-slate-900">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
