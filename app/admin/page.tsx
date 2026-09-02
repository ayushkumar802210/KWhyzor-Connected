import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user ? await supabase.from('profiles').select('role').eq('id', user.id).single() : { data: null };
  if (!user || profile?.role !== 'super_admin') return <main className="p-8">Unauthorized</main>;
  const { data } = await supabase.rpc('get_admin_analytics');
  const stats = data as { total_users?: number; total_bills?: number; total_simulations?: number; users_created_this_month?: number } | null;
  const metrics = [{ label: 'Total users', value: stats?.total_users ?? 'Not available' }, { label: 'New users', value: stats?.users_created_this_month ?? 'Not available' }, { label: 'Uploaded bills', value: stats?.total_bills ?? 'Not available' }, { label: 'Analyzed bills', value: stats?.total_simulations ?? 'Not available' }];
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-6xl">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Admin</div>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Platform administration</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="card-surface p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{metric.label}</div>
              <div className="mt-4 text-3xl font-black text-slate-900">{metric.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-black text-slate-900">Access control status</h2>
          <p className="mt-3 text-sm text-slate-600">Only the authorised owner-controlled super admin account can access this dashboard. Role assignment occurs server-side and is never trusted from the browser.</p>
        </div>
      </div>
    </main>
  );
}
