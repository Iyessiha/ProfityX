# ProfityX v2

Trading assisté par IA pour la CEDEAO, le Nigeria et le Kenya. Français et anglais.

> Avertissement : le trading comporte un risque élevé de perte de capital. ProfityX ne garantit aucun gain et ne fournit pas de conseil financier personnalisé.

## Stack

- Next.js 15 (App Router, TypeScript)
- Supabase (authentification, Postgres, RLS)
- Vercel (hébergement)
- Paiements à venir : GeniusPay, Paystack, M-Pesa (Kenya)

## Étape 1 (en cours) : socle

- Authentification e-mail / mot de passe, confirmation par e-mail
- Schéma : `profiles`, `plans`, `credit_costs`, `subscriptions`, `payments`, `credit_balances`, `credit_ledger`
- Crédits : débit uniquement côté serveur (fonction `spend_credits`), historique complet
- Crédits d'essai (20) attribués automatiquement à l'inscription
- Pages : accueil, tarifs, connexion, inscription, tableau de bord
- FR / EN

Hors étape 1 (prochaines étapes) : analyse de captures, calendrier économique, moteur de signaux, EA MT5, webhooks de paiement, remboursement automatique des crédits en cas d'échec.

## Installation locale

```bash
npm install
cp .env.example .env.local   # puis renseigner les variables
npm run dev
```

### Variables d'environnement

| Variable | Usage |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL publique (liens de confirmation e-mail) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique (anon / publishable) |
| `NEXT_PUBLIC_AFFILIATE_VPS_URL` | Lien affilié VPS (optionnel) |
| `NEXT_PUBLIC_AFFILIATE_EXNESS_URL` | Lien affilié Exness (optionnel) |

La clé `service_role` ne doit jamais apparaître dans ce dépôt ni dans une variable `NEXT_PUBLIC_*`. Elle servira uniquement aux webhooks de paiement, côté serveur, dans une étape ultérieure.

## Base de données

Appliquer `supabase/migrations/0001_init.sql` sur le projet Supabase ProfityX (SQL Editor ou `supabase db push`).

Règles de sécurité :
- Les tables de crédits, abonnements et paiements n'ont aucune politique d'écriture pour `anon` / `authenticated`.
- Le solde ne change que par `private.apply_credit_change`, appelée par `spend_credits` (utilisateur connecté) ou `grant_plan_payment` (serveur uniquement).
- Le coût d'une action est lu dans `credit_costs`, jamais envoyé par le client.

Dans Supabase, activer « Confirm email » dans Authentication, et ajouter l'URL du site dans les « Redirect URLs » (`/auth/callback`).

## Crédits

| Action | Coût |
| --- | --- |
| Question rapide | 1 |
| Calendrier économique | 1 |
| Signal IA | 3 |
| Analyse de capture | 5 |
| Exécution d'un trade via EA | 1 |

Utilisation côté serveur :

```ts
import { spendCredits } from '@/lib/credits';

const result = await spendCredits('chart_analysis', ref);
if (!result.ok) { /* crédits insuffisants */ }
```

## Prix

Les prix (15 $ et 39 $) sont provisoires. Ils sont stockés dans la table `plans`.
