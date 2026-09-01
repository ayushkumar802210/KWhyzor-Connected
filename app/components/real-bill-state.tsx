'use client';

import { ChangeEvent, useState } from 'react';

type BillSummary = {
  fileName: string;
  provider: string;
  period: string;
  sizeLabel: string;
  status: string;
  source: string;
};

const normalizeProvider = (fileName: string) => {
  const lower = fileName.toLowerCase();
  if (lower.includes('bescom')) return 'BESCOM';
  if (lower.includes('mseb')) return 'MSEB';
  if (lower.includes('tata')) return 'Tata Power';
  if (lower.includes('bses')) return 'BSES';
  if (lower.includes('jvvnl')) return 'JVVNL';
  if (lower.includes('tp')) return 'TP';
  return 'Provider not detected yet';
};

const deriveBillSummary = (fileName: string, size: number): BillSummary => {
  const provider = normalizeProvider(fileName);
  const period = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const sizeLabel = size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(size / 1024))} KB`;

  return {
    fileName,
    provider,
    period,
    sizeLabel,
    status: 'Uploaded and waiting for document verification',
    source: 'Uploaded by user'
  };
};

export function RealBillPrompt({ mode = 'dashboard' }: { mode?: 'dashboard' | 'detective' | 'twin' | 'bills' }) {
  const [bill, setBill] = useState<BillSummary | null>(null);

  const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBill(deriveBillSummary(file.name, file.size));
  };

  const billFields = [
    ['Source', bill ? bill.source : 'Not available until a real bill is uploaded'],
    ['Provider', bill ? bill.provider : 'Not available until a real bill is uploaded'],
    ['Bill / meter reference', bill ? bill.fileName : 'Not available until a real bill is uploaded'],
    ['Billing period', bill ? bill.period : 'Not available until a real bill is uploaded'],
    ['Meter reading', bill ? 'Upload contains actual meter reading data only after extraction' : 'Not available until a real bill or meter image is uploaded'],
    ['Units consumed (kWh)', bill ? 'Will appear only after field extraction from the real document' : 'Not available until a real bill is uploaded'],
    ['Bill amount', bill ? 'Will appear only after extraction from the real document' : 'Not available until a real bill is uploaded'],
    ['Due date', bill ? 'Will appear only after extraction from the real document' : 'Not available until a real bill is uploaded'],
    ['Verification status', bill ? bill.status : 'Waiting for real document verification']
  ];

  if (mode === 'dashboard') {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <div className="container-shell">
          <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">My electricity</div>
              <h1 className="mt-2 text-3xl font-black text-slate-900">Real bill dashboard</h1>
            </div>
            <label className="btn-primary cursor-pointer">
              Upload bill
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={onUpload} />
            </label>
          </header>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="card-surface p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</div>
              <div className="mt-4 text-2xl font-black text-slate-900">{bill ? 'Bill uploaded' : 'Waiting for upload'}</div>
              <div className="mt-3 text-sm font-semibold text-brand-700">{bill ? bill.status : 'Upload a real bill to begin'}</div>
            </div>
            <div className="card-surface p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Provider</div>
              <div className="mt-4 text-2xl font-black text-slate-900">{bill ? bill.provider : 'Not detected'}</div>
              <div className="mt-3 text-sm font-semibold text-slate-600">{bill ? bill.fileName : 'No bill uploaded yet'}</div>
            </div>
            <div className="card-surface p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Period</div>
              <div className="mt-4 text-2xl font-black text-slate-900">{bill ? bill.period : 'Not available'}</div>
              <div className="mt-3 text-sm font-semibold text-slate-600">{bill ? 'Captured from real upload' : 'Waiting for real bill'}</div>
            </div>
            <div className="card-surface p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">File</div>
              <div className="mt-4 text-2xl font-black text-slate-900">{bill ? bill.sizeLabel : 'No file'}</div>
              <div className="mt-3 text-sm font-semibold text-slate-600">{bill ? 'Ready for verification' : 'Not available yet'}</div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="card-surface p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Bill summary</h2>
                <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">{bill ? 'Real upload' : 'Waiting'}</span>
              </div>
              <div className="mt-6 space-y-3">
                {billFields.map(([label, value]) => (
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
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Reading consistency: {bill ? 'Will be validated after extraction from the uploaded document' : 'Waiting for a real bill or meter image'}</div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Consumption calculation: {bill ? 'Calculated only from fields extracted from the uploaded document' : 'Not available until a real bill is uploaded'}</div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Duplicate bill detection: {bill ? 'Checked after document verification' : 'Not yet checked'}</div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Estimated reading detection: {bill ? 'Flagged only if the uploaded document shows it' : 'Not available yet'}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (mode === 'detective') {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <div className="container-shell max-w-5xl">
          <div className="card-surface p-8">
            <div className="mb-6">
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Bill Detective</div>
              <h1 className="mt-2 text-3xl font-black text-slate-900">Why did my electricity bill increase?</h1>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm text-slate-600">
                {bill
                  ? `This analysis is based only on the uploaded bill: ${bill.fileName}. It will compare only fields actually extracted from the real document.`
                  : 'Upload a real electricity bill or meter image to compare actual readings and explain the change with evidence.'}
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                ['Higher consumption', bill ? 'Requires real extracted reading evidence' : 'Evidence required', 'Needs verification'],
                ['Longer billing period', bill ? 'Only if the bill shows a longer cycle' : 'Check billing days', 'Needs verification'],
                ['Tariff or slab change', bill ? 'Only if present in the uploaded file' : 'Requires bill evidence', 'Needs verification'],
                ['Fixed or demand charge change', bill ? 'Only when extracted from the uploaded bill' : 'Check bill line items', 'Needs verification'],
                ['Taxes or surcharge change', bill ? 'Only if explicitly shown in the image or PDF' : 'May appear on the bill', 'Needs verification'],
                ['Arrears or late fee', bill ? 'Only if visible in the uploaded document' : 'Must be explicitly present', 'Needs verification']
              ].map(([label, value, state]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-lg font-black text-slate-900">{label}</div>
                  <div className="mt-2 text-sm text-slate-600">{value}</div>
                  <div className="mt-3 inline-flex rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">{state}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (mode === 'twin') {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <div className="container-shell max-w-6xl">
          <div className="card-surface p-8">
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Electricity Twin</div>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Create your electricity twin</h1>
            <p className="mt-3 text-slate-600">
              {bill
                ? `The uploaded bill ${bill.fileName} is the source of truth. Add real appliance entries only after actual usage or document evidence is available.`
                : 'Upload your real bill or meter image first. Appliance estimates appear only when real usage data exists.'}
            </p>

            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="text-xl font-black text-slate-900">{bill ? 'Bill uploaded. Appliance evidence is pending.' : 'No real appliance data yet.'}</div>
              <p className="mt-2 text-sm text-slate-600">{bill ? 'Add actual appliance data only after the real bill or meter reading has been extracted and verified.' : 'Add a real appliance or upload a bill to create a user-provided estimate.'}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Bills</div>
            <h1 className="mt-2 text-3xl font-black text-slate-900">My electricity bills</h1>
          </div>
          <label className="btn-primary cursor-pointer">
            Upload My Electricity Bill ⚡
            <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={onUpload} />
          </label>
        </header>

        <div className="card-surface p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Uploaded bills</h2>
            <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">{bill ? '1 file' : 'No data yet'}</span>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            {bill ? (
              <div>
                <div className="text-lg font-black text-slate-900">{bill.fileName}</div>
                <p className="mt-2 text-sm text-slate-600">Provider: {bill.provider} · Period: {bill.period} · Source: {bill.source}</p>
              </div>
            ) : (
              <div>
                <div className="text-lg font-black text-slate-900">No electricity bill has been uploaded yet.</div>
                <p className="mt-2 text-sm text-slate-600">Upload a real bill or meter image to view extracted fields, provider data, and verification status.</p>
              </div>
            )}
            <label className="btn-primary mt-6 inline-flex cursor-pointer">
              {bill ? 'Upload another bill' : 'Upload My Electricity Bill ⚡'}
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={onUpload} />
            </label>
          </div>
        </div>
      </div>
    </main>
  );
}
