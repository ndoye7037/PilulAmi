import { router, Stack } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, SectionTitle } from '@/components/ui';
import { adherenceHistory, formatClock, formatHM } from '@/lib/schedule';
import { useStore, useToday } from '@/lib/store';
import type { Slot } from '@/lib/types';
import { colors, radius, statusStyle } from '@/theme';

export default function AidantDashboard() {
  const { meds, logs, now, settings, confirmSlot, undoSlot, loadExample } = useStore();
  const slots = useToday();
  const name = settings.seniorName;

  const missed = slots.filter((s) => s.status === 'missed');
  const done = slots.filter((s) => s.status === 'taken').length;
  const history = adherenceHistory(meds, logs, now, settings.graceMinutes);

  const header = (
    <Stack.Screen
      options={{
        headerRight: () => (
          <Pressable onPress={() => router.push('/reglages')} hitSlop={10} accessibilityLabel="Réglages">
            <Text style={{ fontSize: 22 }}>⚙️</Text>
          </Pressable>
        ),
      }}
    />
  );

  if (meds.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {header}
        <Text style={styles.h1}>Configurons le traitement de {name}</Text>
        <Text style={styles.lead}>
          Une photo de l'ordonnance suffit : PilulAmi remplit le planning, vous n'avez plus qu'à vérifier.
        </Text>
        <Card style={{ gap: 12 }}>
          <Text style={styles.step}>1. Photographiez l'ordonnance</Text>
          <Text style={styles.step}>2. {name} reçoit un rappel à chaque prise</Text>
          <Text style={styles.step}>3. Vous voyez en direct si tout va bien</Text>
        </Card>
        <Button title="📷  Scanner l'ordonnance" onPress={() => router.push('/scan')} />
        <Button title="Ajouter un médicament à la main" variant="secondary" onPress={() => router.push('/medicament')} />
        <Button title="Charger un exemple (démo)" variant="ghost" onPress={loadExample} />
      </ScrollView>
    );
  }

  const askConfirm = (slot: Slot) => {
    const label = `Prise de ${formatHM(slot.time)}`;
    if (slot.status === 'taken') {
      confirmAction(label, 'Annuler la confirmation de cette prise ?', () => undoSlot(slot.time));
    } else {
      confirmAction(label, `Marquer comme prise (par exemple après avoir appelé ${name}) ?`, () =>
        confirmSlot(slot.time),
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {header}
      <View>
        <Text style={styles.kicker}>
          {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
        <Text style={styles.h1}>La journée de {name}</Text>
      </View>

      {missed.length > 0 ? (
        <View style={[styles.banner, { backgroundColor: colors.dangerSoft, borderColor: colors.danger }]}>
          <Text style={[styles.bannerTitle, { color: colors.danger }]}>
            ⚠️ {missed.length === 1 ? 'Une prise non confirmée' : `${missed.length} prises non confirmées`}
          </Text>
          <Text style={styles.bannerText}>
            {missed.map((s) => formatHM(s.time)).join(', ')} : {name} n'a pas appuyé sur le bouton. Un petit appel ?
          </Text>
        </View>
      ) : (
        <View style={[styles.banner, { backgroundColor: colors.successSoft, borderColor: colors.success }]}>
          <Text style={[styles.bannerTitle, { color: colors.success }]}>✓ Tout va bien</Text>
          <Text style={styles.bannerText}>
            {done} / {slots.length} prises confirmées aujourd'hui.
          </Text>
        </View>
      )}

      <SectionTitle>Aujourd'hui</SectionTitle>
      <View style={{ gap: 10 }}>
        {slots.map((slot) => (
          <SlotRow key={slot.time} slot={slot} onPress={() => askConfirm(slot)} />
        ))}
      </View>

      <SectionTitle>7 derniers jours</SectionTitle>
      <Card style={styles.history}>
        {history.map((h) => {
          const ratio = h.expected ? h.taken / h.expected : null;
          const color =
            ratio === null ? colors.line : ratio === 1 ? colors.success : ratio >= 0.5 ? colors.warning : colors.danger;
          return (
            <View key={h.day} style={styles.histCol}>
              <View style={styles.histTrack}>
                <View style={[styles.histBar, { height: `${Math.max(ratio ?? 0, 0.06) * 100}%`, backgroundColor: color }]} />
              </View>
              <Text style={styles.histLabel}>{h.label}</Text>
              <Text style={styles.histValue}>{h.expected ? `${h.taken}/${h.expected}` : '–'}</Text>
            </View>
          );
        })}
      </Card>

      <SectionTitle
        action={
          <Pressable onPress={() => router.push('/medicament')} hitSlop={10}>
            <Text style={styles.link}>+ Ajouter</Text>
          </Pressable>
        }
      >
        Traitement
      </SectionTitle>
      <View style={{ gap: 10 }}>
        {meds.map((med) => (
          <Pressable
            key={med.id}
            onPress={() => router.push({ pathname: '/medicament', params: { id: med.id } })}
            style={({ pressed }) => [styles.medCard, pressed && { opacity: 0.8 }]}
          >
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={styles.medName}>{med.name}</Text>
              <Text style={styles.medMeta}>
                {med.dosage}
                {med.instructions ? ` · ${med.instructions}` : ''}
              </Text>
            </View>
            <View style={styles.timesWrap}>
              {[...med.times].sort().map((t) => (
                <Text key={t} style={styles.timeTag}>
                  {formatHM(t)}
                </Text>
              ))}
            </View>
          </Pressable>
        ))}
      </View>
      <Button title="📷  Scanner une nouvelle ordonnance" variant="secondary" onPress={() => router.push('/scan')} />

      <Button
        title={`Passer en mode ${name} sur ce téléphone`}
        variant="ghost"
        onPress={() => router.push('/senior')}
      />
    </ScrollView>
  );
}

function SlotRow({ slot, onPress }: { slot: Slot; onPress: () => void }) {
  const st = statusStyle[slot.status];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.slot, pressed && { opacity: 0.85 }]}>
      <View style={styles.slotTimeCol}>
        <Text style={styles.slotTime}>{formatHM(slot.time)}</Text>
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        {slot.doses.map(({ med }) => (
          <Text key={med.id} style={styles.slotMed} numberOfLines={1}>
            {med.name}
          </Text>
        ))}
        {slot.status === 'taken' && slot.takenAt ? (
          <Text style={styles.slotSub}>Confirmé à {formatClock(slot.takenAt)}</Text>
        ) : null}
      </View>
      <View style={[styles.pill, { backgroundColor: st.bg }]}>
        <Text style={[styles.pillText, { color: st.fg }]}>
          {st.icon} {st.label}
        </Text>
      </View>
    </Pressable>
  );
}

function confirmAction(title: string, message: string, onOk: () => void) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${title}\n${message}`)) onOk();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Oui', onPress: onOk },
  ]);
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 14, paddingBottom: 48 },
  kicker: { fontSize: 15, color: colors.muted, textTransform: 'capitalize' },
  h1: { fontSize: 28, fontWeight: '800', color: colors.ink, letterSpacing: -0.5 },
  lead: { fontSize: 17, lineHeight: 24, color: colors.muted },
  step: { fontSize: 17, color: colors.ink, fontWeight: '600' },
  banner: { borderRadius: radius.l, borderWidth: 1.5, padding: 16, gap: 4 },
  bannerTitle: { fontSize: 18, fontWeight: '800' },
  bannerText: { fontSize: 15, lineHeight: 21, color: colors.ink },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
  },
  slotTimeCol: { width: 58 },
  slotTime: { fontSize: 18, fontWeight: '800', color: colors.ink },
  slotMed: { fontSize: 15, color: colors.ink, fontWeight: '600' },
  slotSub: { fontSize: 13, color: colors.muted },
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  pillText: { fontSize: 13, fontWeight: '700' },
  history: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14 },
  histCol: { alignItems: 'center', gap: 4, flex: 1 },
  histTrack: {
    height: 64,
    width: 16,
    borderRadius: 8,
    backgroundColor: '#F1ECE3',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  histBar: { width: '100%', borderRadius: 8 },
  histLabel: { fontSize: 13, fontWeight: '700', color: colors.ink },
  histValue: { fontSize: 11, color: colors.muted },
  link: { fontSize: 16, fontWeight: '700', color: colors.primary },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
  },
  medName: { fontSize: 16, fontWeight: '700', color: colors.ink },
  medMeta: { fontSize: 14, color: colors.muted },
  timesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end', maxWidth: 130 },
  timeTag: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.primarySoft,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: 'hidden',
  },
});
