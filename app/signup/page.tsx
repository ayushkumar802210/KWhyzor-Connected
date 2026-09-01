export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-xl font-black text-white">⚡</div>
          <div>
            <div className="text-xl font-black text-slate-900">KWhyzor</div>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Create account</div>
          </div>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Start smarter energy decisions</h1>
        <p className="mt-2 text-sm text-slate-600">Set up your account and begin understanding your bill, usage, and home energy profile.</p>
        <form className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Full name
            <input type="text" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-0 transition focus:border-brand-500" placeholder="Your name" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input type="email" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-0 transition focus:border-brand-500" placeholder="you@example.com" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input type="password" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-0 transition focus:border-brand-500" placeholder="Minimum 6 characters" />
          </label>
          <button type="submit" className="btn-primary w-full">Create account</button>
          <div className="text-center text-sm text-slate-500">Already have an account? <a href="/signin" className="font-semibold text-brand-700">Sign in</a></div>
        </form>
      </div>
    </main>
  );
}
