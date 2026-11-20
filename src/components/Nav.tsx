import Link from 'next/link';
import { PRODUCT_NAME, type Locale } from '@/lib/config';
import { t } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/app/actions/auth';

export default async function Nav({ locale }: { locale: Locale }) {
  const m = t(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="topbar">
      <div className="container">
        <Link href="/" className="brand">
          Profit<span>yX</span>
        </Link>
        <nav className="nav">
          <Link href="/pricing">{m('navPricing')}</Link>
          {user ? (
            <>
              <Link href="/dashboard">{m('navDashboard')}</Link>
              <form action={signOut}>
                <button type="submit" className="btn btn-ghost" style={{ padding: '6px 12px' }}>
                  {m('navLogout')}
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">{m('navLogin')}</Link>
              <Link href="/signup" className="btn" style={{ padding: '6px 12px' }}>
                {m('navSignup')}
              </Link>
            </>
          )}
          <span className="lang nav" aria-label="Language">
            <Link href={`/api/locale?lang=fr&next=`} className={locale === 'fr' ? 'active' : ''} data-app={PRODUCT_NAME}>
              FR
            </Link>
            <Link href={`/api/locale?lang=en&next=`} className={locale === 'en' ? 'active' : ''}>
              EN
            </Link>
          </span>
        </nav>
      </div>
    </header>
  );
}
