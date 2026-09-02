import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'super_admin') return Response.json({ error: 'Admin access required.' }, { status: 403 });

  const { data, error } = await supabase.rpc('get_admin_analytics');
  if (error) return Response.json({ error: 'Unable to load admin analytics.' }, { status: 500 });
  return Response.json({
    ok: true,
    stats: data
  });
}
