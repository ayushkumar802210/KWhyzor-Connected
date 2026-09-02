'use client';

import { FormEvent, useState } from 'react';

export default function ManualBillPage() {
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    const number = (name: string) => {
      const value = form.get(name)?.toString().trim();
      return value ? Number(value) : undefined;
    };
    const response = await fetch('/api/meter-readings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meterNumber: form.get('meterNumber')?.toString().trim() || undefined,
        provider: form.get('provider')?.toString().trim() || undefined,
        consumerNumber: form.get('consumerNumber')?.toString().trim() || undefined,
        billDate: form.get('billDate')?.toString() || undefined,
        dueDate: form.get('dueDate')?.toString() || undefined,
        totalPayable: number('totalPayable'),
        unitsKwh: number('unitsKwh'),
        previousReading: number('previousReading'),
        currentReading: number('currentReading'),
        multiplier: number('multiplier'),
        readingDate: form.get('readingDate')?.toString() || undefined,
        readingStatus: form.get('readingStatus') || 'UNKNOWN'
      })
    });
    const result = await response.json() as { message?: string; error?: string };
    setMessage(result.message || result.error || 'Unable to save meter details.');
    setIsSaving(false);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-2xl">
        <div className="card-surface p-8">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Manual entry</div>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Enter actual meter details</h1>
          <p className="mt-3 text-sm text-slate-600">Only values you provide are saved. Leave unknown fields blank.</p>
          <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={submit}>
            <label className="text-sm font-medium text-slate-700">Meter number<input name="meterNumber" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
            <label className="text-sm font-medium text-slate-700">Provider / DISCOM<input name="provider" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
            <label className="text-sm font-medium text-slate-700">Consumer number<input name="consumerNumber" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
            <label className="text-sm font-medium text-slate-700">Reading date<input name="readingDate" type="date" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
            <label className="text-sm font-medium text-slate-700">Bill date<input name="billDate" type="date" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
            <label className="text-sm font-medium text-slate-700">Due date<input name="dueDate" type="date" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
            <label className="text-sm font-medium text-slate-700">Previous reading<input name="previousReading" type="number" min="0" step="0.001" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
            <label className="text-sm font-medium text-slate-700">Current reading<input name="currentReading" type="number" min="0" step="0.001" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
            <label className="text-sm font-medium text-slate-700">Multiplier / MF<input name="multiplier" type="number" min="0" step="0.001" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
            <label className="text-sm font-medium text-slate-700">Units (kWh)<input name="unitsKwh" type="number" min="0" step="0.001" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
            <label className="text-sm font-medium text-slate-700">Total payable<input name="totalPayable" type="number" min="0" step="0.01" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
            <label className="text-sm font-medium text-slate-700">Reading status<select name="readingStatus" defaultValue="UNKNOWN" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"><option>UNKNOWN</option><option>ACTUAL</option><option>ESTIMATED</option><option>PROVISIONAL</option></select></label>
            <button type="submit" className="btn-primary md:col-span-2" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save meter details'}</button>
          </form>
          {message ? <p className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{message}</p> : null}
        </div>
      </div>
    </main>
  );
}
