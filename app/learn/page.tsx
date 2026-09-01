const categories = [
  'Electricity Basics',
  'Electricity Bills',
  'Meters',
  'Smart Meters',
  'Tariffs',
  'Charges',
  'Solar',
  'EV',
  'Energy Saving',
  'Electrical Safety',
  'Consumer Awareness'
];

const entries = [
  { title: 'What is a meter?', description: 'A meter records electricity consumption in your home or business. It measures the amount of energy used over time.' },
  { title: 'What is kWh?', description: 'A kWh is a unit of energy consumption, equal to one kilowatt used for one hour.' },
  { title: 'What is fixed charge?', description: 'A fixed charge is a service or connection charge that may apply regardless of consumption.' },
  { title: 'What is a tariff slab?', description: 'A tariff slab is the price band for electricity consumption. Different usage ranges may be priced differently.' },
  { title: 'What is estimated reading?', description: 'An estimated reading is a calculated meter reading when the actual reading is unavailable or not captured.' }
];

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-6xl">
        <div className="mb-8">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Learn</div>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Electricity knowledge center</h1>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <div key={category} className="info-chip">{category}</div>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => (
            <article key={entry.title} className="card-surface p-6">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-xl text-brand-700">⚡</div>
              <h2 className="text-xl font-black text-slate-900">{entry.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{entry.description}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
