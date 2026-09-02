import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function safeDestination(value: string | null) {
  return value?.startsWith('/') && !value.startsWith('//') ? value : '/dashboard';
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const next = safeDestination(request.nextUrl.searchParams.get('next'));
  if (!code) return NextResponse.redirect(new URL('/signin?error=invalid_callback', request.url));

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL('/signin?error=callback_failed', request.url));
  return NextResponse.redirect(new URL(next, request.url));
}
