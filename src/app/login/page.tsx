import Link from 'next/link';
import { signIn } from '@/app/actions/auth';
import { getLocale } from '@/lib/locale';
import { t } from '@/lib/i18n';

export const metadata = { title: 'Connexion' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const locale = await getLocale();
  const m = t(locale);
  const { error, message } = await searchParams;

  return (
    <div className="auth-wrap">
      <h1 style={{ fontSize: '1.5rem' }}>{m('loginTitle')}</h1>

      {message === 'check_email' && <p className="alert alert-ok">{m('checkEmail')}</p>}
      {error === 'invalid' && <p className="alert alert-error">{m('errInvalid')}</p>}
      {error === 'generic' && <p className="alert alert-error">{m('errGeneric')}</p>}

      <form action={signIn} className="form">
        <div className="field">
          <label htmlFor="email">{m('emailLabel')}</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">{m('passwordLabel')}</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <button type="submit" className="btn btn-block">
          {m('loginSubmit')}
        </button>
      </form>

      <p className="muted" style={{ marginTop: 18 }}>
        {m('noAccount')} <Link href="/signup">{m('signupLink')}</Link>
      </p>
    </div>
  );
}
