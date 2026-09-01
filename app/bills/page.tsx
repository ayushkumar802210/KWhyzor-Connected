import Link from 'next/link';

export default function BillsPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Bills</div>
            <h1 className="mt-2 text-3xl font-black text-slate-900">My electricity bills</h1>
          </div>
          <Link href="/bills/upload" className="btn-primary">Upload My Electricity Bill ⚡</Link>
        </header>

        <div className="card-surface p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Historical bills</h2>
            <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">No data yet</span>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="text-lg font-black text-slate-900">No electricity bill has been uploaded yet.</div>
            <p className="mt-2 text-sm text-slate-600">Upload a real bill to see your consumption, comparison, and breakdown.</p>
            <Link href="/bills/upload" className="btn-primary mt-6">Upload My Electricity Bill ⚡</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
