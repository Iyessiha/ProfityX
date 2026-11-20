'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { PASSWORD_MIN_LENGTH } from '@/lib/config';
import { createClient } from '@/lib/supabase/server';

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').trim();
}

export async function signIn(formData: FormData) {
  const email = str(formData, 'email');
  const password = String(formData.get('password') ?? '');

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect('/login?error=invalid');
  }
  redirect('/dashboard');
}

export async function signUp(formData: FormData) {
  const email = str(formData, 'email');
  const password = String(formData.get('password') ?? '');
  const fullName = str(formData, 'full_name').slice(0, 120);
  const termsAccepted = formData.get('terms') === 'on';

  if (!termsAccepted) {
    redirect('/signup?error=terms');
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    redirect('/signup?error=password');
  }

  const h = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? `${h.get('x-forwarded-proto') ?? 'https'}://${h.get('host')}`;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect('/signup?error=generic');
  }
  redirect('/login?message=check_email');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
