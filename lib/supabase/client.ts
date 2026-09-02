import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env';

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase is not configured.');
  }

  browserClient ??= createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return browserClient;
}
