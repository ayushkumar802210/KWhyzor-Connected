const sampleQuestions = [
  'Why did my bill increase?',
  'What is my meter reading?',
  'How much did I consume?',
  'What does FPPPA mean?',
  'How much extra does my EV cost?'
];

export default function AssistantPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-5xl">
        <div className="card-surface p-8">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Ask KWhyzor ⚡</div>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Evidence-based electricity help</h1>
          <p className="mt-3 text-slate-600">The assistant uses verified bill data, deterministic calculations, and only responds with information available to the authenticated user.</p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <textarea className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-brand-500" rows={5} placeholder="Ask about your electricity bill, meter reading, EV, solar, or tariff details..." />
            <div className="mt-4 flex justify-end">
              <button className="btn-primary">Ask KWhyzor</button>
            </div>
          </div>

          <div className="mt-8">
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Popular questions</div>
            <div className="mt-4 flex flex-wrap gap-3">
              {sampleQuestions.map((question) => (
                <button key={question} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">{question}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
