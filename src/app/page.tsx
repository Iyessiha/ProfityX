import Link from 'next/link';
import { AffiliateNotice, RiskNotice } from '@/components/Footer';
import { getLocale } from '@/lib/locale';
import { t } from '@/lib/i18n';

export default async function HomePage() {
  const locale = await getLocale();
  const m = t(locale);

  const features = [
    { title: m('feat1Title'), text: m('feat1Text') },
    { title: m('feat2Title'), text: m('feat2Text') },
    { title: m('feat3Title'), text: m('feat3Text') },
    { title: m('feat4Title'), text: m('feat4Text') },
  ];

  return (
    <>
      <section className="hero">
        <h1>{m('heroTitle')}</h1>
        <p>{m('heroText')}</p>
        <div className="hero-actions">
          <Link href="/signup" className="btn">
            {m('heroCta')}
          </Link>
          <Link href="/pricing" className="btn btn-ghost">
            {m('heroSecondary')}
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="grid">
          {features.map((f) => (
            <div className="card" key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <RiskNotice locale={locale} />
      <AffiliateNotice locale={locale} />
    </>
  );
}
