import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.redirect(new URL('/signin', request.url));
  const form = await request.formData();
  const values = {
    full_name: String(form.get('full_name') ?? '').trim() || null,
    display_name: String(form.get('display_name') ?? '').trim() || null,
    phone: String(form.get('phone') ?? '').trim() || null,
    location: String(form.get('location') ?? '').trim() || null
  };
  const { error } = await supabase.from('profiles').update(values).eq('id', user.id);
  if (error) return Response.json({ error: 'Profile could not be saved.' }, { status: 500 });
  return Response.redirect(new URL('/profile', request.url));
}
