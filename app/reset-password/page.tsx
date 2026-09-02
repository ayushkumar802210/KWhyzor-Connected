'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const client = createClient();
      client.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
      const { data: listener } = client.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY' || session) setReady(true);
      });
      return () => listener.subscription.unsubscribe();
    } catch {
      setMessage('Authentication is not configured. Please configure Supabase credentials.');
      return undefined;
    }
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 6 || password !== confirm) {
      setMessage(password.length < 6 ? 'Password must be at least 6 characters.' : 'Passwords do not match.');
      return;
    }
    setSaving(true);
    const { error } = await createClient().auth.updateUser({ password });
    setMessage(error ? error.message : 'Password updated. You can sign in with your new password.');
    if (!error) setTimeout(() => router.push('/signin'), 700);
    setSaving(false);
  }

  return <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6"><div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8"><h1 className="text-3xl font-black text-slate-900">Set a new password</h1>{!ready ? <p className="mt-4 text-sm text-slate-600">Open this page from a valid password-reset email.</p> : <form onSubmit={submit} className="mt-8 space-y-4"><input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" className="w-full rounded-xl border border-slate-200 px-3 py-2.5" /><input type="password" required minLength={6} value={confirm} onChange={(event) => setConfirm(event.target.value)} placeholder="Confirm password" className="w-full rounded-xl border border-slate-200 px-3 py-2.5" /><button className="btn-primary w-full" disabled={saving}>{saving ? 'Updating...' : 'Update password'}</button></form>}{message ? <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{message}</p> : null}</div></main>;
}
