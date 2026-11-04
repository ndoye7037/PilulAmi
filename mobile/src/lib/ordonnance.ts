import type { Medication } from './types';

export type DraftMed = Omit<Medication, 'id'> & { key: string; keep: boolean };

/**
 * Lecture de l'ordonnance.
 *
 * ⚠️ PROTOTYPE : la reconnaissance est simulée. Pour la version réelle, envoyer
 * l'image à un service d'OCR / modèle de vision hébergé chez un hébergeur certifié
 * HDS (données de santé), qui renvoie la liste structurée ci-dessous.
 * Dans tous les cas, l'aidant vérifie et corrige chaque ligne avant validation.
 */
export async function analyserOrdonnance(_imageUri: string): Promise<DraftMed[]> {
  await new Promise((r) => setTimeout(r, 1600));
  return [
    { name: 'Doliprane 1000 mg', dosage: '1 comprimé', times: ['08:00', '20:00'], instructions: 'Si douleur, 3 par jour maximum' },
    { name: 'Lévothyrox 75 µg', dosage: '1 comprimé', times: ['07:30'], instructions: 'À jeun, 30 min avant le petit-déjeuner' },
    { name: 'Ramipril 5 mg', dosage: '1 gélule', times: ['08:00'] },
  ].map((m, i) => ({ ...m, key: String(i), keep: true }));
}

export const DEMO_OCR = true;
