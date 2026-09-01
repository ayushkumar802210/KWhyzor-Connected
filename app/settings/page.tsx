export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-4xl">
        <div className="card-surface p-8">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Settings</div>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Account preferences</h1>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Display name
              <input defaultValue="User" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Email
              <input defaultValue="user@example.com" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              City
              <input defaultValue="Delhi" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              State
              <input defaultValue="Delhi" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
            </label>
          </div>
          <div className="mt-8 flex gap-3">
            <button className="btn-primary">Save changes</button>
            <button className="btn-secondary">Change password</button>
          </div>
        </div>
      </div>
    </main>
  );
}
