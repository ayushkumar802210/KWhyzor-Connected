export default function BillUploadPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-4xl">
        <div className="card-surface p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Upload</div>
              <h1 className="mt-2 text-3xl font-black text-slate-900">Upload your electricity bill</h1>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl">📄</div>
          </div>

          <div className="mt-8 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="text-4xl">⚡</div>
            <p className="mt-4 text-xl font-black text-slate-900">Upload My Electricity Bill ⚡</p>
            <p className="mt-2 text-sm text-slate-600">Supported formats: PDF, JPG, JPEG, PNG, WebP</p>
            <label className="btn-primary mt-6 inline-flex cursor-pointer">
              Select bill file
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" />
            </label>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">File validation</div>
              <div className="mt-2 text-sm text-slate-700">Type, MIME, size, and signature checks before storage.</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Provider detection</div>
              <div className="mt-2 text-sm text-slate-700">Regional layout, language, and utility detection before OCR.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
