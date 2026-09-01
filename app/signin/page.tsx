export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-xl font-black text-white">⚡</div>
          <div>
            <div className="text-xl font-black text-slate-900">KWhyzor</div>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Sign in</div>
          </div>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">Continue tracking your energy, bills, and smarter home decisions.</p>
        <form className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input type="email" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-0 transition focus:border-brand-500" placeholder="you@example.com" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input type="password" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-0 transition focus:border-brand-500" placeholder="••••••••" />
          </label>
          <button type="submit" className="btn-primary w-full">Sign In</button>
          <div className="text-center text-sm text-slate-500">Need an account? <a href="/signup" className="font-semibold text-brand-700">Create one</a></div>
        </form>
      </div>
    </main>
  );
}
