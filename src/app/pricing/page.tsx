import { AffiliateNotice, RiskNotice } from '@/components/Footer';
import { PRODUCT_NAME } from '@/lib/config';
import { t } from '@/lib/i18n';
import { getLocale } from '@/lib/locale';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Tarifs' };

type PlanRow = {
  code: string;
  name_fr: string;
  name_en: string;
  kind: 'trial' | 'subscription' | 'pack';
  price_usd: number;
  credits: number;
  includes_ea: boolean;
};

type CostRow = { feature: string; cost: number; label_fr: string; label_en: string };

export default async function PricingPage() {
  const locale = await getLocale();
  const m = t(locale);

  // Lecture publique (RLS : lecture autorisée à anon). Les prix ne sont jamais codés en dur ici.
  const supabase = await createClient();
  const [{ data: plans }, { data: costs }] = await Promise.all([
    supabase.from('plans').select('code,name_fr,name_en,kind,price_usd,credits,includes_ea').eq('active', true).order('price_usd'),
    supabase.from('credit_costs').select('feature,cost,label_fr,label_en').order('cost'),
  ]);

  const planRows = (plans ?? []) as PlanRow[];
  const costRows = (costs ?? []) as CostRow[];

  return (
    <>
      <section className="section">
        <h1 style={{ fontSize: '1.9rem', margin: '24px 0 8px' }}>{m('pricingTitle')}</h1>
        <p className="muted">{m('pricingText')}</p>
        <p className="muted" style={{ fontSize: '0.9rem' }}>
          {m('priceProvisional')}
        </p>
      </section>

      <section className="section">
        <div className="grid">
          {planRows.map((p) => (
            <div className="card plan-card" key={p.code}>
              <h3>{locale === 'fr' ? p.name_fr : p.name_en}</h3>
              <div className="plan-price">
                {p.price_usd === 0 ? m('free') : `${p.price_usd} $`}
                {p.kind === 'subscription' && <span className="muted" style={{ fontSize: '0.9rem' }}> {m('perMonth')}</span>}
              </div>
              <ul className="plan-list">
                <li>
                  {p.credits} {m('credits')}
                </li>
                <li>{p.includes_ea ? m('eaIncluded') : m('eaNotIncluded')}</li>
              </ul>
              {p.kind === 'trial' ? (
                <p className="muted" style={{ fontSize: '0.88rem', margin: 0 }}>
                  {m('trialNote')}
                </p>
              ) : (
                <button className="btn btn-block" disabled title={`${PRODUCT_NAME}`}>
                  {m('subscribeSoon')}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>{m('costsTitle')}</h2>
        <div className="card" style={{ padding: '4px 16px' }}>
          <table>
            <tbody>
              {costRows.map((c) => (
                <tr key={c.feature}>
                  <td>{locale === 'fr' ? c.label_fr : c.label_en}</td>
                  <td className="num">
                    {c.cost} {m('credits')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <RiskNotice locale={locale} />
      <AffiliateNotice locale={locale} />
    </>
  );
}
