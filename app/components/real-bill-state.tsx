'use client';

import { ChangeEvent, useState } from 'react';

type BillSummary = {
  status: 'processing' | 'verification_required' | 'error';
  message: string;
  documentId?: string;
};

type VerifiedBill = {
  id: string;
  provider: string | null;
  bill_date: string | null;
  due_date: string | null;
  units_kwh: number | null;
  total_payable: number | null;
};

export function RealBillPrompt({ mode = 'dashboard', verifiedBillCount = 0, latestBill = null }: { mode?: 'dashboard' | 'detective' | 'twin' | 'bills'; verifiedBillCount?: number; latestBill?: VerifiedBill | null }) {
  const [bill, setBill] = useState<BillSummary | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setBill({ status: 'processing', message: 'Your bill is being processed.' });

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/bills/upload', { method: 'POST', body: formData });
      const result = (await response.json()) as { message?: string; error?: string; status?: string; documentId?: string };

      if (!response.ok) {
        setBill({ status: result.status === 'not_configured' ? 'verification_required' : 'error', message: result.message ?? result.error ?? 'The bill could not be uploaded.', documentId: result.documentId });
        return;
      }

      setBill({ status: 'verification_required', message: result.message ?? 'Bill uploaded. Review is required before verification.', documentId: result.documentId });
    } catch {
      setBill({ status: 'error', message: 'The bill could not be uploaded. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  const billFields = [
    ['Source', 'Not available until a real bill is processed'],
    ['Provider', 'Not available until extracted from the bill'],
    ['Bill / meter reference', 'Not available until extracted from the bill'],
    ['Billing period', 'Not available until extracted from the bill'],
    ['Meter reading', 'Not available until extracted from the bill'],
    ['Units consumed (kWh)', 'Not available until extracted from the bill'],
    ['Bill amount', 'Not available until extracted from the bill'],
    ['Due date', 'Not available until extracted from the bill'],
    ['Verification status', bill ? bill.message : 'No electricity data available yet.']
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
              {isUploading ? 'Processing bill...' : 'Upload bill'}
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={onUpload} />
            </label>
          </header>

          {verifiedBillCount === 0 ? (
            <div className="card-surface p-8">
              <h2 className="text-2xl font-black text-slate-900">No electricity data available yet.</h2>
              <p className="mt-3 text-slate-600">Upload your real electricity bill or enter your actual meter/bill information to start.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/bills/upload" className="btn-primary">Upload Electricity Bill</a>
                <a href="/bills/manual" className="btn-secondary">Enter Meter / Bill Details</a>
                <a href="/electricity-twin" className="btn-secondary">Create Electricity Twin</a>
              </div>
            </div>
          ) : null}

          {verifiedBillCount > 0 ? <div className="mb-4 text-sm font-semibold text-emerald-700">{verifiedBillCount} verified bill{verifiedBillCount === 1 ? '' : 's'} found.</div> : null}

          {latestBill ? (
            <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="card-surface p-5"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Provider</div><div className="mt-3 text-xl font-black text-slate-900">{latestBill.provider ?? 'Not identified'}</div><div className="mt-2 text-xs text-slate-500">ACTUAL_FROM_BILL or USER_PROVIDED</div></div>
              <div className="card-surface p-5"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Consumption</div><div className="mt-3 text-xl font-black text-slate-900">{latestBill.units_kwh === null ? 'Not available' : `${latestBill.units_kwh} kWh`}</div><div className="mt-2 text-xs text-slate-500">Source preserved in bill fields</div></div>
              <div className="card-surface p-5"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Bill date</div><div className="mt-3 text-xl font-black text-slate-900">{latestBill.bill_date ?? 'Not available'}</div><div className="mt-2 text-xs text-slate-500">No date is inferred</div></div>
              <div className="card-surface p-5"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Total payable</div><div className="mt-3 text-xl font-black text-slate-900">{latestBill.total_payable === null ? 'Not available' : `₹${latestBill.total_payable}`}</div><div className="mt-2 text-xs text-slate-500">Source preserved in bill fields</div></div>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="card-surface p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</div>
              <div className="mt-4 text-2xl font-black text-slate-900">{bill ? 'Bill uploaded' : 'Waiting for upload'}</div>
              <div className="mt-3 text-sm font-semibold text-brand-700">{bill ? bill.status : 'Upload a real bill to begin'}</div>
            </div>
            <div className="card-surface p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Provider</div>
              <div className="mt-4 text-2xl font-black text-slate-900">Not available</div>
              <div className="mt-3 text-sm font-semibold text-slate-600">Only evidence extracted from a real bill can identify the provider.</div>
            </div>
            <div className="card-surface p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Period</div>
              <div className="mt-4 text-2xl font-black text-slate-900">Not available</div>
              <div className="mt-3 text-sm font-semibold text-slate-600">Only the bill&apos;s actual dates can define its billing period.</div>
            </div>
            <div className="card-surface p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">File</div>
              <div className="mt-4 text-2xl font-black text-slate-900">{bill?.status ?? 'No data'}</div>
              <div className="mt-3 text-sm font-semibold text-slate-600">An upload is not verified electricity data.</div>
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
                {verifiedBillCount < 2
                  ? 'Upload another verified bill to compare changes.'
                  : 'This analysis compares only verified bills and explains only differences supported by their evidence.'}
              </div>
            </div>

            {verifiedBillCount >= 2 ? <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
            </div> : null}
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
                ? 'The document is not yet verified. Add appliance estimates only when real inputs are available.'
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
                <div className="text-lg font-black text-slate-900">Bill processing status</div>
                <p className="mt-2 text-sm text-slate-600">{bill.message}</p>
                {bill.documentId ? <a href={`/bills/review/${bill.documentId}`} className="mt-4 inline-flex font-semibold text-brand-700">Open review status</a> : null}
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
