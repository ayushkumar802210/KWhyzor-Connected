const solarInputs = [
  { label: 'Solar capacity', value: 'Not configured' },
  { label: 'Estimated generation', value: 'Not configured' },
  { label: 'Grid import', value: 'Not configured' },
  { label: 'Grid export', value: 'Not configured' },
  { label: 'Net consumption', value: 'Not configured' }
];

export default function SolarPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-5xl">
        <div className="card-surface p-8">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Solar / Net metering</div>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Estimated solar scenario</h1>
          <p className="mt-3 text-slate-600">This is an estimate based on user-entered assumptions. It is not actual meter or generation data.</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {solarInputs.map((item) => (
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
