import { AFFILIATE_LINKS, PRODUCT_NAME, type Locale } from '@/lib/config';
import { t } from '@/lib/i18n';

// Avertissement sur les risques présent sur toutes les pages.
export function RiskNotice({ locale }: { locale: Locale }) {
  const m = t(locale);
  return (
    <aside className="notice notice-risk" role="note">
      <strong>{m('riskTitle')}</strong>
      {m('riskText')}
    </aside>
  );
}

// Liens affiliés : n'apparaissent que si une URL est configurée, et sont toujours signalés.
export function AffiliateNotice({ locale }: { locale: Locale }) {
  const m = t(locale);
  const links = AFFILIATE_LINKS.filter((l) => l.url);
  if (links.length === 0) return null;

  const labels: Record<string, string> = {
    vps: locale === 'fr' ? 'Hébergement VPS' : 'VPS hosting',
    exness: 'Exness',
  };

  return (
    <aside className="notice notice-affiliate" role="note">
      <strong>{m('affiliateTitle')}</strong>
      <p style={{ margin: '4px 0 8px' }}>{m('affiliateText')}</p>
      {links.map((l) => (
        <a
          key={l.key}
          href={l.url}
          target="_blank"
          rel="sponsored noopener noreferrer"
          style={{ marginRight: 16 }}
        >
          {labels[l.key]}
          <span className="badge">{m('affiliateBadge')}</span>
        </a>
      ))}
    </aside>
  );
}

export default function Footer({ locale }: { locale: Locale }) {
  const m = t(locale);
  return (
    <footer className="footer">
      <div className="container">
        <div className="links">
          <span>
            © {new Date().getFullYear()} {PRODUCT_NAME}
          </span>
          <a href="/pricing">{m('navPricing')}</a>
          <a href="/terms">{m('footerLegal')}</a>
          <a href="/privacy">{m('footerPrivacy')}</a>
        </div>
        <p style={{ margin: 0 }}>{m('riskText')}</p>
      </div>
    </footer>
  );
}
