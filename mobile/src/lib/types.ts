export type Medication = {
  id: string;
  name: string;
  /** Ex. « 1 comprimé », « 500 mg » */
  dosage: string;
  /** Heures de prise au format "HH:MM" */
  times: string[];
  /** Ex. « pendant le repas » */
  instructions?: string;
};

/** Clé : `${YYYY-MM-DD}|${medId}|${HH:MM}` → date ISO de la prise */
export type DoseLogs = Record<string, string>;

export type Mode = 'senior' | 'aidant';

export type Settings = {
  onboarded: boolean;
  /** Comment l'aidant appelle son proche : « Maman », « Papa », « Jeanne »… */
  seniorName: string;
  /** Prénom de l'aidant, affiché côté senior */
  aidantName: string;
  /** Délai (minutes) après l'heure prévue avant de considérer la prise comme oubliée */
  graceMinutes: number;
  /** Mode ouvert au démarrage sur cet appareil */
  mode: Mode | null;
};

export type DoseStatus = 'taken' | 'upcoming' | 'due' | 'missed';

export type SlotDose = { med: Medication; takenAt?: string };

export type Slot = {
  time: string;
  minutes: number;
  doses: SlotDose[];
  status: DoseStatus;
  /** Toutes les prises du créneau sont confirmées : heure de la dernière confirmation */
  takenAt?: string;
};
