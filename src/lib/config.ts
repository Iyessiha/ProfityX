// Configuration produit. Les prix et forfaits réels vivent dans la table `plans` (Supabase).
// Ce fichier ne contient que ce qui est nécessaire au code côté application.

export const PRODUCT_NAME = 'ProfityX';

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'fr';
export const LOCALE_COOKIE = 'locale';

// Doit correspondre exactement aux lignes de la table `credit_costs`.
export const FEATURE_COSTS = {
  quick_question: 1,
  economic_calendar: 1,
  ai_signal: 3,
  chart_analysis: 5,
  ea_trade_execution: 1,
} as const;
export type FeatureCode = keyof typeof FEATURE_COSTS;

// Liens affiliés : affichés seulement si l'URL est renseignée, et toujours signalés.
export const AFFILIATE_LINKS: { key: 'vps' | 'exness'; url: string | undefined }[] = [
  { key: 'vps', url: process.env.NEXT_PUBLIC_AFFILIATE_VPS_URL },
  { key: 'exness', url: process.env.NEXT_PUBLIC_AFFILIATE_EXNESS_URL },
];

export const PASSWORD_MIN_LENGTH = 8;
