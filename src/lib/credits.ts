import { FEATURE_COSTS, type FeatureCode } from './config';
import { createClient } from './supabase/server';

export type SpendResult =
  | { ok: true; balance: number }
  | { ok: false; reason: 'insufficient_credits' | 'not_authenticated' };

// Débite le coût d'une fonctionnalité pour l'utilisateur connecté.
// À appeler AVANT l'appel coûteux (API Anthropic, EA, etc.) côté serveur uniquement.
// Le coût n'est pas un paramètre : il est lu en base à partir du code de fonctionnalité.
export async function spendCredits(feature: FeatureCode, ref?: string): Promise<SpendResult> {
  if (!(feature in FEATURE_COSTS)) {
    throw new Error(`Fonctionnalité inconnue : ${feature}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc('spend_credits', {
    p_feature: feature,
    p_ref: ref ?? null,
  });

  if (error) {
    if (error.message.includes('insufficient_credits')) {
      return { ok: false, reason: 'insufficient_credits' };
    }
    if (error.message.includes('not_authenticated')) {
      return { ok: false, reason: 'not_authenticated' };
    }
    throw new Error(error.message);
  }

  return { ok: true, balance: data as number };
}
