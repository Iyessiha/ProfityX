import { redirect } from 'next/navigation';
import { signOut } from '@/app/actions/auth';
import { RiskNotice } from '@/components/Footer';
import { t, type MessageKey } from '@/lib/i18n';
import { getLocale } from '@/lib/locale';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Tableau de bord' };

type LedgerRow = {
  id: number;
  delta: number;
  balance_after: number;
  kind: 'trial' | 'subscription' | 'pack' | 'spend' | 'refund' | 'adjustment';
  reason: string;
  created_at: string;
};

const KIND_KEY: Record<LedgerRow['kind'], MessageKey> = {
  trial: 'kindTrial',
  subscription: 'kindSubscription',
  pack: 'kindPack',
  spend: 'kindSpend',
  refund: 'kindRefund',
  adjustment: 'kindAdjustment',
};

export default async function DashboardPage() {
  const locale = await getLocale();
  const m = t(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Toutes les lectures passent par la RLS : l'utilisateur ne voit que ses lignes.
  const [{ data: balance }, { data: subs }, { data: ledger }] = await Promise.all([
    supabase.from('credit_balances').select('balance').eq('user_id', user.id).maybeSingle(),
    supabase
      .from('subscriptions')
      .select('plan_code,status,current_period_end')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1),
    supabase
      .from('credit_ledger')
      .select('id,delta,balance_after,kind,reason,created_at')
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const current = subs?.[0];
  const rows = (ledger ?? []) as LedgerRow[];
  const dateFmt = new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  return (
    <>
      <section className="section">
        <h1 style={{ fontSize: '1.7rem', margin: '24px 0 16px' }}>{m('dashTitle')}</h1>

        <div className="grid">
          <div className="card">
            <div className="muted">{m('balance')}</div>
            <div className="stat">
              {balance?.balance ?? 0} <span style={{ fontSize: '1rem' }}>{m('credits')}</span>
            </div>
          </div>
          <div className="card">
            <div className="muted">{m('currentPlan')}</div>
            {current ? (
              <>
                <div className="stat" style={{ fontSize: '1.4rem' }}>
                  {current.plan_code}
                </div>
                <div className="muted" style={{ fontSize: '0.9rem' }}>
                  {m('renewsOn')} {dateFmt.format(new Date(current.current_period_end))}
                </div>
              </>
            ) : (
              <p style={{ marginTop: 8 }}>{m('noSubscription')}</p>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <h2>{m('history')}</h2>
        <div className="card" style={{ padding: '4px 16px', overflowX: 'auto' }}>
          {rows.length === 0 ? (
            <p className="muted">{m('noHistory')}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>{m('colDate')}</th>
                  <th>{m('colLabel')}</th>
                  <th className="num">{m('colDelta')}</th>
                  <th className="num">{m('colBalance')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="muted" style={{ whiteSpace: 'nowrap' }}>
                      {dateFmt.format(new Date(r.created_at))}
                    </td>
                    <td>
                      {m(KIND_KEY[r.kind])} · <span className="muted">{r.reason}</span>
                    </td>
                    <td className={`num ${r.delta > 0 ? 'pos' : 'neg'}`}>
                      {r.delta > 0 ? `+${r.delta}` : r.delta}
                    </td>
                    <td className="num">{r.balance_after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <form action={signOut} style={{ marginBottom: 8 }}>
        <button type="submit" className="btn btn-ghost">
          {m('navLogout')}
        </button>
      </form>

      <RiskNotice locale={locale} />
    </>
  );
}
