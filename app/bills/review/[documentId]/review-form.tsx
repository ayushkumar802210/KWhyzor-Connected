'use client';

import { FormEvent, useState } from 'react';

type Fields = { provider?: string | null; consumerNumber?: string | null; meterNumber?: string | null; billNumber?: string | null; billDate?: string | null; dueDate?: string | null; unitsKwh?: number | null; totalPayable?: number | null };

export function ReviewForm({ documentId, fields }: { documentId: string; fields: Fields }) {
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage('');
    const form = new FormData(event.currentTarget);
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    form.set('decision', submitter?.value === 'reject' ? 'reject' : 'verify');
    const response = await fetch(`/api/bills/review/${documentId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form.entries())) });
    const result = await response.json() as { error?: string; ok?: boolean };
    setMessage(result.ok ? 'Bill verified and saved.' : result.error || 'Unable to verify bill.'); setSaving(false);
  }
  const input = (name: keyof Fields, label: string, type = 'text') => <label className="text-sm font-medium text-slate-700">{label}<input name={name} type={type} defaultValue={fields[name] == null ? '' : String(fields[name])} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2" /></label>;
  return <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">{input('provider', 'Provider')}{input('consumerNumber', 'Consumer number')}{input('meterNumber', 'Meter number')}{input('billNumber', 'Bill number')}{input('billDate', 'Bill date', 'date')}{input('dueDate', 'Due date', 'date')}{input('unitsKwh', 'Units (kWh)', 'number')}{input('totalPayable', 'Total payable', 'number')}<button name="decision" value="verify" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Confirm and verify bill'}</button><button name="decision" value="reject" className="btn-secondary" disabled={saving}>Reject bill</button>{message ? <p className="md:col-span-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{message}</p> : null}</form>;
}
