export default function PaymentsPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-5xl">
        <div className="mb-8">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Payments</div>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Transaction history</h1>
        </div>

        <div className="card-surface p-8 text-center">
          <div className="text-xl font-black text-slate-900">No payment records available yet.</div>
          <p className="mt-2 text-sm text-slate-600">Your verified electricity payment history will appear here after a real transaction is recorded.</p>
        </div>
      </div>
    </main>
  );
}
