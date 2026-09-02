import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user ? await supabase.from('profiles').select('full_name, display_name, phone, location').eq('id', user.id).single() : { data: null };

  return (
    <main className="min-h-screen bg-slate-100 p-6"><div className="container-shell max-w-4xl"><div className="card-surface p-6 md:p-8">
      <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Profile</div><h1 className="mt-2 text-3xl font-black text-slate-900">My account</h1>
      {!user ? <p className="mt-6 text-slate-600">Sign in to view and update your profile.</p> : <form action="/api/profile" method="post" className="mt-8 grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Full name<input name="full_name" defaultValue={profile?.full_name ?? ''} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
        <label className="text-sm font-medium text-slate-700">Display name<input name="display_name" defaultValue={profile?.display_name ?? ''} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
        <label className="text-sm font-medium text-slate-700">Phone<input name="phone" defaultValue={profile?.phone ?? ''} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
        <label className="text-sm font-medium text-slate-700">Location<input name="location" defaultValue={profile?.location ?? ''} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
        <button type="submit" className="btn-primary md:col-span-2">Save changes</button>
      </form>}
    </div></div></main>
  );
}
