export default function SimulatorPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-5xl">
        <div className="card-surface p-8">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Simulator</div>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Before vs after comparison</h1>
          <p className="mt-3 text-slate-600">This tool is only available after the user adds real electricity data or user-provided assumptions. It never invents your bill.</p>

          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="text-xl font-black text-slate-900">No verified bill available for comparison.</div>
            <p className="mt-2 text-sm text-slate-600">Upload a real bill or enter actual meter details to enable comparison.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
