import type { Locale } from './config';

// Dictionnaire FR / EN. Toute clé ajoutée doit exister dans les deux langues.
const messages = {
  fr: {
    navPricing: 'Tarifs',
    navLogin: 'Connexion',
    navSignup: 'Créer un compte',
    navDashboard: 'Tableau de bord',
    navLogout: 'Déconnexion',

    heroTitle: "Analyse de trading assistée par IA, pensée pour l'Afrique de l'Ouest et le Kenya",
    heroText:
      "Analysez vos graphiques à partir d'une capture, suivez le calendrier économique et recevez des signaux IA. Un système de crédits transparent : vous payez ce que vous utilisez, rien de plus.",
    heroCta: 'Commencer avec 20 crédits offerts',
    heroSecondary: 'Voir les tarifs',

    feat1Title: 'Analyse de capture',
    feat1Text: "Envoyez une capture de graphique : l'IA décrit la structure, les niveaux clés et les scénarios possibles.",
    feat2Title: 'Calendrier économique',
    feat2Text: 'Les publications susceptibles de faire bouger les marchés, avec votre fuseau horaire.',
    feat3Title: 'Signaux IA',
    feat3Text: "Des idées de trade commentées, avec un niveau d'invalidation. Information uniquement, pas un conseil financier.",
    feat4Title: 'Exécution via EA MT5',
    feat4Text:
      "Un Expert Advisor que vous installez vous-même, avec contrôle de risque local et arrêt d'urgence. Vos identifiants MT5 ne sont jamais stockés sur nos serveurs.",

    riskTitle: 'Avertissement sur les risques',
    riskText:
      "Le trading de CFD, de Forex et d'autres instruments à effet de levier comporte un risque élevé de perte de la totalité de votre capital. Les analyses et signaux sont générés par une IA et peuvent se tromper. Les performances passées ne préjugent pas des résultats futurs. Aucun gain n'est garanti. Ne tradez qu'avec des fonds que vous pouvez vous permettre de perdre.",
    affiliateTitle: 'Liens affiliés',
    affiliateText:
      "Certains liens (hébergement VPS, courtier Exness) sont des liens affiliés : nous pouvons recevoir une commission si vous y souscrivez, sans surcoût pour vous.",
    affiliateBadge: 'Lien affilié',
    footerLegal: 'Conditions',
    footerPrivacy: 'Confidentialité',

    loginTitle: 'Connexion',
    emailLabel: 'E-mail',
    passwordLabel: 'Mot de passe',
    loginSubmit: 'Se connecter',
    noAccount: 'Pas encore de compte ?',
    signupLink: 'Créer un compte',

    signupTitle: 'Créer un compte',
    fullNameLabel: 'Nom complet',
    termsLabel:
      "J'ai lu et j'accepte l'avertissement sur les risques ainsi que les conditions d'utilisation.",
    signupSubmit: 'Créer mon compte',
    haveAccount: 'Déjà un compte ?',
    loginLink: 'Se connecter',

    errInvalid: 'E-mail ou mot de passe incorrect.',
    errPassword: 'Le mot de passe doit contenir au moins 8 caractères.',
    errTerms: "Vous devez accepter l'avertissement sur les risques.",
    errGeneric: "Une erreur est survenue. Réessayez dans quelques instants.",
    checkEmail: 'Vérifiez votre boîte e-mail pour confirmer votre compte.',

    dashTitle: 'Tableau de bord',
    balance: 'Solde de crédits',
    credits: 'crédits',
    currentPlan: 'Forfait actuel',
    noSubscription: 'Aucun abonnement actif. Vous utilisez votre essai ou des packs ponctuels.',
    renewsOn: 'Renouvellement le',
    history: 'Historique de consommation',
    noHistory: 'Aucune opération pour le moment.',
    colDate: 'Date',
    colLabel: 'Opération',
    colDelta: 'Crédits',
    colBalance: 'Solde',
    kindTrial: 'Essai',
    kindSubscription: 'Abonnement',
    kindPack: 'Pack',
    kindSpend: 'Utilisation',
    kindRefund: 'Remboursement',
    kindAdjustment: 'Ajustement',

    pricingTitle: 'Tarifs',
    pricingText: "Des crédits, pas d'illimité. Vous payez pour ce que vous utilisez.",
    perMonth: '/ mois',
    eaIncluded: 'EA MT5 inclus',
    eaNotIncluded: 'EA MT5 non inclus',
    subscribeSoon: 'Paiement bientôt disponible',
    costsTitle: 'Coût en crédits par action',
    trialNote: "Essai : 20 crédits offerts à l'inscription, sans carte bancaire.",
    priceProvisional: 'Prix provisoires, susceptibles de changer avant le lancement.',
    free: 'Gratuit',

    insufficient: 'Crédits insuffisants pour cette action. Consultez les tarifs pour recharger.',
  },
  en: {
    navPricing: 'Pricing',
    navLogin: 'Log in',
    navSignup: 'Create account',
    navDashboard: 'Dashboard',
    navLogout: 'Log out',

    heroTitle: 'AI-assisted trading analysis, built for West Africa and Kenya',
    heroText:
      'Analyse your charts from a screenshot, follow the economic calendar and receive AI signals. A transparent credit system: you pay for what you use, nothing more.',
    heroCta: 'Start with 20 free credits',
    heroSecondary: 'See pricing',

    feat1Title: 'Chart screenshot analysis',
    feat1Text: 'Send a chart screenshot: the AI describes the structure, key levels and possible scenarios.',
    feat2Title: 'Economic calendar',
    feat2Text: 'Releases likely to move markets, shown in your time zone.',
    feat3Title: 'AI signals',
    feat3Text: 'Commented trade ideas with an invalidation level. For information only, not financial advice.',
    feat4Title: 'Execution via MT5 EA',
    feat4Text:
      'An Expert Advisor you install yourself, with local risk control and an emergency stop. Your MT5 credentials are never stored on our servers.',

    riskTitle: 'Risk warning',
    riskText:
      'Trading CFDs, Forex and other leveraged instruments carries a high risk of losing your entire capital. Analyses and signals are generated by AI and can be wrong. Past performance is no guarantee of future results. No profit is guaranteed. Only trade with funds you can afford to lose.',
    affiliateTitle: 'Affiliate links',
    affiliateText:
      'Some links (VPS hosting, Exness broker) are affiliate links: we may receive a commission if you sign up, at no extra cost to you.',
    affiliateBadge: 'Affiliate link',
    footerLegal: 'Terms',
    footerPrivacy: 'Privacy',

    loginTitle: 'Log in',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    loginSubmit: 'Log in',
    noAccount: "Don't have an account?",
    signupLink: 'Create an account',

    signupTitle: 'Create an account',
    fullNameLabel: 'Full name',
    termsLabel: 'I have read and accept the risk warning and the terms of use.',
    signupSubmit: 'Create my account',
    haveAccount: 'Already have an account?',
    loginLink: 'Log in',

    errInvalid: 'Incorrect email or password.',
    errPassword: 'Password must be at least 8 characters.',
    errTerms: 'You must accept the risk warning.',
    errGeneric: 'Something went wrong. Please try again shortly.',
    checkEmail: 'Check your inbox to confirm your account.',

    dashTitle: 'Dashboard',
    balance: 'Credit balance',
    credits: 'credits',
    currentPlan: 'Current plan',
    noSubscription: 'No active subscription. You are using your trial or one-time packs.',
    renewsOn: 'Renews on',
    history: 'Usage history',
    noHistory: 'No activity yet.',
    colDate: 'Date',
    colLabel: 'Activity',
    colDelta: 'Credits',
    colBalance: 'Balance',
    kindTrial: 'Trial',
    kindSubscription: 'Subscription',
    kindPack: 'Pack',
    kindSpend: 'Usage',
    kindRefund: 'Refund',
    kindAdjustment: 'Adjustment',

    pricingTitle: 'Pricing',
    pricingText: 'Credits, not unlimited. You pay for what you use.',
    perMonth: '/ month',
    eaIncluded: 'MT5 EA included',
    eaNotIncluded: 'MT5 EA not included',
    subscribeSoon: 'Payment coming soon',
    costsTitle: 'Credit cost per action',
    trialNote: 'Trial: 20 credits given at sign-up, no card required.',
    priceProvisional: 'Provisional prices, subject to change before launch.',
    free: 'Free',

    insufficient: 'Not enough credits for this action. See pricing to top up.',
  },
} as const;

export type MessageKey = keyof (typeof messages)['fr'];

export function t(locale: Locale): (key: MessageKey) => string {
  return (key) => messages[locale][key];
}
