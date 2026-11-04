import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { computeDay, formatHM, minutesOfDay } from './schedule';
import type { DoseLogs, Medication, Settings } from './types';

const CHANNEL = 'rappels';
const supported = Platform.OS !== 'web';

export function configureNotifications() {
  if (!supported) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Rappels de médicaments',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 400, 200, 400],
    }).catch(() => {});
  }
}

export async function ensurePermission(): Promise<boolean> {
  if (!supported) return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

/**
 * Reprogramme toutes les notifications locales :
 *  - un rappel quotidien pour chaque horaire de prise (pour le senior) ;
 *  - pour aujourd'hui, une alerte « prise non confirmée » à l'heure + délai de grâce,
 *    annulée dès que la prise est confirmée (pour l'aidant).
 *
 * Prototype mono-appareil : en production, l'alerte aidant partirait d'un serveur
 * vers le téléphone de l'aidant (push), pas du téléphone du senior.
 */
export async function rescheduleAll(meds: Medication[], logs: DoseLogs, settings: Settings) {
  if (!supported) return;
  try {
    const perm = await Notifications.getPermissionsAsync();
    if (!perm.granted) return;
    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = new Date();
    const slots = computeDay(meds, logs, now, settings.graceMinutes);

    for (const slot of slots) {
      const [hour, minute] = slot.time.split(':').map(Number);
      const names = slot.doses.map((d) => d.med.name).join(', ');
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `💊 C'est l'heure de vos médicaments`,
          body: `${formatHM(slot.time)} : ${names}. Appuyez ensuite sur « J'ai pris mon médicament ».`,
          data: { kind: 'reminder', time: slot.time },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
          channelId: CHANNEL,
        },
      });

      const alertAt = slot.minutes + settings.graceMinutes;
      if (slot.status !== 'taken' && alertAt > minutesOfDay(now)) {
        const date = new Date(now);
        date.setHours(0, alertAt, 0, 0);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `⚠️ Prise de ${formatHM(slot.time)} non confirmée`,
            body: `${settings.seniorName} n'a pas encore confirmé : ${names}.`,
            data: { kind: 'alert', time: slot.time },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date,
            channelId: CHANNEL,
          },
        });
      }
    }
  } catch (e) {
    console.warn('[PilulAmi] Programmation des notifications impossible', e);
  }
}
