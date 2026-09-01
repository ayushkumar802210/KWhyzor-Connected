export default function ElectricityTwinPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-6xl">
        <div className="card-surface p-8">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Electricity Twin</div>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Create your electricity twin</h1>
          <p className="mt-3 text-slate-600">Add the appliances that actually exist in your home. Estimates only appear after you provide real appliance data.</p>

          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="text-xl font-black text-slate-900">No appliances added yet.</div>
            <p className="mt-2 text-sm text-slate-600">Add a real appliance to create a user-provided estimate.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
