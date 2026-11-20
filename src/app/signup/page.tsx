import Link from 'next/link';
import { signUp } from '@/app/actions/auth';
import { PASSWORD_MIN_LENGTH } from '@/lib/config';
import { getLocale } from '@/lib/locale';
import { t } from '@/lib/i18n';
import { RiskNotice } from '@/components/Footer';

export const metadata = { title: 'Créer un compte' };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const locale = await getLocale();
  const m = t(locale);
  const { error } = await searchParams;

  const errorText: Record<string, string> = {
    terms: m('errTerms'),
    password: m('errPassword'),
    generic: m('errGeneric'),
  };

  return (
    <div className="auth-wrap">
      <h1 style={{ fontSize: '1.5rem' }}>{m('signupTitle')}</h1>

      {error && errorText[error] && <p className="alert alert-error">{errorText[error]}</p>}

      <form action={signUp} className="form">
        <div className="field">
          <label htmlFor="full_name">{m('fullNameLabel')}</label>
          <input id="full_name" name="full_name" type="text" autoComplete="name" maxLength={120} />
        </div>
        <div className="field">
          <label htmlFor="email">{m('emailLabel')}</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">{m('passwordLabel')}</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={PASSWORD_MIN_LENGTH}
            required
          />
        </div>
        <label className="check">
          <input type="checkbox" name="terms" required />
          <span>{m('termsLabel')}</span>
        </label>
        <button type="submit" className="btn btn-block">
          {m('signupSubmit')}
        </button>
      </form>

      <RiskNotice locale={locale} />

      <p className="muted">
        {m('haveAccount')} <Link href="/login">{m('loginLink')}</Link>
      </p>
    </div>
  );
}
