export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-4xl">
        <div className="card-surface p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Profile</div>
              <h1 className="mt-2 text-3xl font-black text-slate-900">My account</h1>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-3xl font-black text-white">AK</div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Full name
              <input defaultValue="Ayush Kumar" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Display name
              <input defaultValue="Ayush" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Phone
              <input defaultValue="+91 98765 43210" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Location
              <input defaultValue="Bengaluru, India" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn-primary">Save changes</button>
            <button className="btn-secondary">Upload photo</button>
            <button className="btn-secondary">Remove photo</button>
          </div>
        </div>
      </div>
    </main>
  );
}
