import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStore, useToday } from '@/lib/store';
import { currentSlot, formatClock, formatHM, nextSlot } from '@/lib/schedule';
import { colors, radius } from '@/theme';

/** Interface senior : très gros caractères, un seul bouton. */
export default function SeniorScreen() {
  const { now, settings, meds, confirmSlot, undoSlot, updateSettings } = useStore();
  const slots = useToday();
  const current = currentSlot(slots, now);
  const next = nextSlot(slots, now);
  const [justTaken, setJustTaken] = useState<{ time: string; at: string } | null>(null);

  const lastTaken = [...slots].reverse().find((s) => s.status === 'taken');
  const dateLabel = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const clock = `${now.getHours()}h${String(now.getMinutes()).padStart(2, '0')}`;
  const aidant = settings.aidantName || 'Votre proche';

  const onConfirm = () => {
    if (!current) return;
    confirmSlot(current.time);
    setJustTaken({ time: current.time, at: new Date().toISOString() });
  };

  const exit = () => {
    updateSettings({ mode: null });
    router.replace('/');
  };

  let body;
  if (meds.length === 0) {
    body = (
      <View style={styles.infoCard}>
        <Text style={styles.infoBig}>Aucun médicament pour l'instant.</Text>
        <Text style={styles.infoText}>{aidant} va configurer votre traitement.</Text>
      </View>
    );
  } else if (justTaken && !current) {
    body = (
      <View style={[styles.infoCard, { backgroundColor: colors.successSoft, borderColor: colors.success }]}>
        <Text style={styles.bigCheck}>✓</Text>
        <Text style={[styles.infoBig, { color: colors.success }]}>C'est noté, merci !</Text>
        <Text style={styles.infoText}>
          Pris à {formatClock(justTaken.at)}.{settings.aidantName ? ` ${settings.aidantName} est rassuré(e).` : ''}
        </Text>
        <Pressable onPress={() => { undoSlot(justTaken.time); setJustTaken(null); }} hitSlop={12}>
          <Text style={styles.undo}>Je me suis trompé(e)</Text>
        </Pressable>
      </View>
    );
  } else if (current) {
    const late = current.status === 'missed';
    body = (
      <>
        <View style={[styles.infoCard, late && { borderColor: colors.warning }]}>
          <Text style={styles.slotLabel}>
            {late ? `Prise de ${formatHM(current.time)} — pas encore confirmée` : `Prise de ${formatHM(current.time)}`}
          </Text>
          {current.doses.map(({ med }) => (
            <View key={med.id} style={styles.medRow}>
              <Text style={styles.medDot}>💊</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medDosage}>
                  {med.dosage}
                  {med.instructions ? ` · ${med.instructions}` : ''}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="J'ai pris mon médicament"
          onPress={onConfirm}
          style={({ pressed }) => [styles.bigButton, pressed && { transform: [{ scale: 0.97 }], opacity: 0.92 }]}
        >
          <Text style={styles.bigButtonIcon}>✓</Text>
          <Text style={styles.bigButtonText}>J'ai pris mon médicament</Text>
        </Pressable>
      </>
    );
  } else {
    body = (
      <View style={styles.infoCard}>
        {lastTaken ? (
          <>
            <Text style={styles.bigCheck}>✓</Text>
            <Text style={[styles.infoBig, { color: colors.success }]}>
              Déjà pris à {formatClock(lastTaken.takenAt!)}
            </Text>
            <Text style={styles.infoText}>Pas besoin d'en reprendre.</Text>
          </>
        ) : (
          <Text style={styles.infoBig}>Rien à prendre pour le moment.</Text>
        )}
        {next ? (
          <Text style={styles.nextText}>Prochaine prise à {formatHM(next.time)}</Text>
        ) : (
          <Text style={styles.nextText}>C'est terminé pour aujourd'hui. Bonne soirée !</Text>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.clock}>{clock}</Text>
          <Text style={styles.date}>{dateLabel}</Text>
        </View>
        <Text style={styles.hello}>Bonjour 👋</Text>
        {body}
        {current && next && !justTaken ? (
          <Text style={styles.nextText}>Ensuite : {formatHM(next.time)}</Text>
        ) : null}
      </ScrollView>
      <Pressable onLongPress={exit} delayLongPress={1200} style={styles.exit} accessibilityHint="Appui long pour quitter">
        <Text style={styles.exitText}>Espace aidant (appui long)</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 22, gap: 20, flexGrow: 1 },
  header: { alignItems: 'center', marginTop: 8 },
  clock: { fontSize: 64, fontWeight: '800', color: colors.ink, letterSpacing: -2 },
  date: { fontSize: 22, color: colors.muted, textTransform: 'capitalize' },
  hello: { fontSize: 26, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.line,
    padding: 24,
    gap: 14,
    alignItems: 'stretch',
  },
  slotLabel: { fontSize: 22, fontWeight: '800', color: colors.primary },
  medRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  medDot: { fontSize: 28 },
  medName: { fontSize: 24, fontWeight: '700', color: colors.ink },
  medDosage: { fontSize: 19, color: colors.muted, marginTop: 2 },
  bigButton: {
    backgroundColor: colors.success,
    borderRadius: radius.xl,
    paddingVertical: 34,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 6,
    shadowColor: colors.success,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  bigButtonIcon: { fontSize: 56, color: '#fff', fontWeight: '900' },
  bigButtonText: { fontSize: 28, color: '#fff', fontWeight: '800', textAlign: 'center' },
  bigCheck: { fontSize: 72, color: colors.success, textAlign: 'center', fontWeight: '900' },
  infoBig: { fontSize: 26, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  infoText: { fontSize: 20, color: colors.muted, textAlign: 'center', lineHeight: 28 },
  nextText: { fontSize: 22, color: colors.primary, textAlign: 'center', fontWeight: '700' },
  undo: { fontSize: 18, color: colors.muted, textAlign: 'center', textDecorationLine: 'underline', marginTop: 6 },
  exit: { alignItems: 'center', paddingVertical: 14 },
  exitText: { fontSize: 13, color: '#A7AFAD' },
});
