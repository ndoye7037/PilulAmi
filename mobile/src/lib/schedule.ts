import type { DoseLogs, Medication, Slot } from './types';

/** Fenêtre (minutes) pendant laquelle on peut confirmer une prise en avance */
export const EARLY_WINDOW = 60;

const pad = (n: number) => String(n).padStart(2, '0');

export function dayKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function isValidHM(value: string): boolean {
  return /^([01]?\d|2[0-3]):[0-5]\d$/.test(value.trim());
}

export function normalizeHM(value: string): string {
  const [h, m] = value.trim().split(':').map(Number);
  return `${pad(h)}:${pad(m)}`;
}

export function hmToMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

/** "08:00" → "8h00" */
export function formatHM(value: string): string {
  const [h, m] = value.split(':');
  return `${Number(h)}h${m}`;
}

export function formatClock(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours()}h${pad(d.getMinutes())}`;
}

export function minutesOfDay(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

export function logKey(day: string, medId: string, time: string): string {
  return `${day}|${medId}|${time}`;
}

/** Regroupe les prises de la journée par horaire, avec leur statut. */
export function computeDay(
  meds: Medication[],
  logs: DoseLogs,
  now: Date,
  graceMinutes: number,
  day: string = dayKey(now),
): Slot[] {
  const isToday = day === dayKey(now);
  const isPast = day < dayKey(now);
  const nowMin = minutesOfDay(now);
  const byTime = new Map<string, Slot>();

  for (const med of meds) {
    for (const time of med.times) {
      let slot = byTime.get(time);
      if (!slot) {
        slot = { time, minutes: hmToMinutes(time), doses: [], status: 'upcoming' };
        byTime.set(time, slot);
      }
      slot.doses.push({ med, takenAt: logs[logKey(day, med.id, time)] });
    }
  }

  const slots = [...byTime.values()].sort((a, b) => a.minutes - b.minutes);
  for (const slot of slots) {
    const allTaken = slot.doses.every((d) => d.takenAt);
    if (allTaken) {
      slot.status = 'taken';
      slot.takenAt = slot.doses
        .map((d) => d.takenAt!)
        .sort()
        .at(-1);
    } else if (isPast || (isToday && nowMin > slot.minutes + graceMinutes)) {
      slot.status = 'missed';
    } else if (isToday && nowMin >= slot.minutes) {
      slot.status = 'due';
    } else {
      slot.status = 'upcoming';
    }
  }
  return slots;
}

/**
 * Créneau que le senior peut confirmer maintenant : le plus ancien créneau non pris
 * dont l'heure est passée ou proche (moins d'une heure).
 */
export function currentSlot(slots: Slot[], now: Date): Slot | undefined {
  const nowMin = minutesOfDay(now);
  return slots.find((s) => s.status !== 'taken' && s.minutes - EARLY_WINDOW <= nowMin);
}

export function nextSlot(slots: Slot[], now: Date): Slot | undefined {
  const nowMin = minutesOfDay(now);
  return slots.find((s) => s.status !== 'taken' && s.minutes - EARLY_WINDOW > nowMin);
}

/** Observance sur les N derniers jours (aujourd'hui inclus, seulement les créneaux déjà échus). */
export function adherenceHistory(
  meds: Medication[],
  logs: DoseLogs,
  now: Date,
  graceMinutes: number,
  days = 7,
) {
  const result: { day: string; label: string; taken: number; expected: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = dayKey(d);
    const slots = computeDay(meds, logs, now, graceMinutes, key).filter(
      (s) => s.status === 'taken' || s.status === 'missed',
    );
    result.push({
      day: key,
      label: d.toLocaleDateString('fr-FR', { weekday: 'narrow' }).toUpperCase(),
      taken: slots.filter((s) => s.status === 'taken').length,
      expected: slots.length,
    });
  }
  return result;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
