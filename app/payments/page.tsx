'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void }; }
}

export default function PaymentsPage() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<{ id: string; amount: number; currency: string; status: string; webhook_verified: boolean; created_at: string }[]>([]);

  useEffect(() => {
    fetch('/api/payments').then((response) => response.ok ? response.json() : null).then((result: { payments?: typeof payments } | null) => setPayments(result?.payments ?? [])).catch(() => setPayments([]));
  }, []);

  async function startPayment() {
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) { setMessage('Enter a valid payment amount.'); return; }
    setLoading(true); setMessage('');
    try {
      const response = await fetch('/api/payments/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: numericAmount }) });
      const result = await response.json() as { error?: string; orderId?: string; amount?: number; currency?: string; keyId?: string };
      if (!response.ok || !result.orderId || !result.keyId) { setMessage(result.error || 'Payment gateway is not configured.'); return; }
      if (!window.Razorpay) { setMessage('Payment checkout is unavailable. Load the Razorpay checkout script before retrying.'); return; }
      const checkout = new window.Razorpay({ key: result.keyId, amount: result.amount, currency: result.currency, order_id: result.orderId, handler: () => setMessage('Payment submitted. Final status will appear after server webhook verification.') });
      checkout.open();
    } catch { setMessage('Payment gateway is unavailable.'); }
    finally { setLoading(false); }
  }

  return <><Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" /><main className="min-h-screen bg-slate-100 p-6"><div className="container-shell max-w-5xl"><div className="mb-8"><div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Payments</div><h1 className="mt-2 text-3xl font-black text-slate-900">Secure payment</h1></div><div className="card-surface max-w-xl p-8"><label className="text-sm font-medium text-slate-700">Amount (INR)<input value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="1" step="0.01" className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2" /></label><button onClick={startPayment} disabled={loading} className="btn-primary mt-5">{loading ? 'Creating order...' : 'Continue to payment'}</button>{message ? <p className="mt-5 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{message}</p> : null}<p className="mt-5 text-sm text-slate-600">Payment success is recorded only after a verified Razorpay webhook. Electricity bill payment requires a separate authorised BBPS integration.</p></div><div className="mt-8 card-surface p-6"><h2 className="text-lg font-black text-slate-900">Payment history</h2>{payments.length ? <div className="mt-4 space-y-2">{payments.map((payment) => <div key={payment.id} className="flex flex-wrap justify-between gap-2 rounded-xl border border-slate-200 p-3 text-sm"><span>{payment.currency} {payment.amount}</span><span>{payment.status}</span><span>{payment.webhook_verified ? 'Verified webhook' : 'Awaiting verification'}</span><span>{new Date(payment.created_at).toLocaleDateString()}</span></div>)}</div> : <p className="mt-3 text-sm text-slate-600">No payment records available.</p>}</div></div></main></>;
}
