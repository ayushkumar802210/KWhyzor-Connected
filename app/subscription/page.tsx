import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function SubscriptionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: subscription } = user
    ? await supabase.from('subscriptions').select('plan, status, gateway, updated_at').eq('user_id', user.id).maybeSingle()
    : { data: null };

  const { data: plans } = await supabase.from('plans').select('name, amount, currency, interval').eq('active', true).order('amount');

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-5xl">
        <div className="mb-8">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Subscription</div>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Manage your plan</h1>
        </div>

        {!user ? (
          <div className="card-surface p-8">
            <p className="text-slate-600">Sign in to view and manage your subscription.</p>
          </div>
        ) : (
          <>
            <div className="card-surface p-8">
              <h2 className="text-xl font-black text-slate-900">Current plan</h2>
              {subscription ? (
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Plan</div>
                    <div className="mt-2 text-xl font-black text-slate-900">{subscription.plan}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</div>
                    <div className="mt-2 text-xl font-black text-slate-900">{subscription.status}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Gateway</div>
                    <div className="mt-2 text-xl font-black text-slate-900">{subscription.gateway ?? 'Not configured'}</div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-slate-600">No active subscription. Select a plan below.</p>
              )}
            </div>

            {plans && plans.length > 0 && (
              <div className="mt-8 card-surface p-8">
                <h2 className="text-xl font-black text-slate-900">Available plans</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {plans.map((plan) => (
                    <div key={plan.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-lg font-black text-slate-900">{plan.name}</div>
                      <div className="mt-2 text-2xl font-black text-brand-700">₹{plan.amount}</div>
                      <div className="mt-1 text-xs text-slate-500">{plan.interval}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
