import Link from 'next/link';

const fieldRows = [
  ['Provider', 'Not available on this bill.'],
  ['Consumer Reference', 'Not available on this bill.'],
  ['Reference Type', 'Not available on this bill.'],
  ['Meter Number', 'Not available on this bill.'],
  ['Previous Reading', 'Not available on this bill.'],
  ['Current Reading', 'Not available on this bill.'],
  ['Consumption', 'Not available on this bill.'],
  ['Bill Amount', 'Not available on this bill.'],
  ['Billing Period', 'Not available on this bill.'],
  ['Due Date', 'Not available on this bill.'],
  ['Reading Status', '? Not available']
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">My electricity</div>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Verified bill dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="btn-secondary">Public site</Link>
            <Link href="/profile" className="btn-primary">My profile</Link>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="card-surface p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</div>
            <div className="mt-4 text-2xl font-black text-slate-900">No verified bill</div>
            <div className="mt-3 text-sm font-semibold text-amber-600">Upload a real bill to begin</div>
          </div>
          <div className="card-surface p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Provider</div>
            <div className="mt-4 text-2xl font-black text-slate-900">Not detected</div>
            <div className="mt-3 text-sm font-semibold text-slate-600">No bill uploaded yet</div>
          </div>
          <div className="card-surface p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Meter</div>
            <div className="mt-4 text-2xl font-black text-slate-900">Not available</div>
            <div className="mt-3 text-sm font-semibold text-slate-600">Not available on this bill.</div>
          </div>
          <div className="card-surface p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Consumption</div>
            <div className="mt-4 text-2xl font-black text-slate-900">Not available</div>
            <div className="mt-3 text-sm font-semibold text-slate-600">This field is missing</div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="card-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">Bill summary</h2>
              <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Waiting for upload</span>
            </div>
            <div className="mt-6 space-y-3">
              {fieldRows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
                  <span className="font-medium text-slate-700">{label}</span>
                  <span className="text-slate-600">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface p-6">
            <h2 className="text-xl font-black text-slate-900">Check my bill</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Reading consistency: Information Missing</div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Consumption calculation: Information Missing</div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Duplicate bill detection: Not yet checked</div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Estimated reading detection: Not available</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
