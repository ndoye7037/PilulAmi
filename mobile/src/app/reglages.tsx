import { router } from 'expo-router';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Chip, Field, SectionTitle } from '@/components/ui';
import { ensurePermission } from '@/lib/notifications';
import { useStore } from '@/lib/store';
import { colors } from '@/theme';

const GRACE_OPTIONS = [
  { minutes: 15, label: '15 min' },
  { minutes: 30, label: '30 min' },
  { minutes: 60, label: '1 h' },
  { minutes: 90, label: '1h30' },
];

export default function Reglages() {
  const { settings, updateSettings, resetAll } = useStore();

  const reset = () => {
    const doIt = () => {
      resetAll();
      router.replace('/');
    };
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.('Effacer toutes les données ?')) doIt();
      return;
    }
    Alert.alert('Tout effacer', 'Le traitement et l’historique seront supprimés de ce téléphone.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Effacer', style: 'destructive', onPress: doIt },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Field
        label="Nom de votre proche"
        value={settings.seniorName}
        onChangeText={(seniorName) => updateSettings({ seniorName })}
      />
      <Field label="Votre prénom" value={settings.aidantName} onChangeText={(aidantName) => updateSettings({ aidantName })} />

      <SectionTitle>Alerte en cas d'oubli</SectionTitle>
      <Text style={styles.text}>Être prévenu si la prise n'est pas confirmée après :</Text>
      <View style={styles.row}>
        {GRACE_OPTIONS.map((o) => (
          <Chip
            key={o.minutes}
            label={o.label}
            selected={settings.graceMinutes === o.minutes}
            onPress={() => updateSettings({ graceMinutes: o.minutes })}
          />
        ))}
      </View>
      <Button title="Autoriser les notifications" variant="secondary" onPress={() => ensurePermission()} />

      <SectionTitle>Vos données</SectionTitle>
      <Card style={{ gap: 8 }}>
        <Text style={styles.text}>
          🔒 Dans ce prototype, tout reste stocké sur ce téléphone. La version finale utilisera un hébergement certifié
          données de santé (HDS), et votre proche garde le contrôle de ce qu'il partage.
        </Text>
        <Text style={styles.text}>PilulAmi aide à suivre un traitement ; il ne donne pas d'avis médical.</Text>
      </Card>

      <Button
        title="Changer d'utilisateur de ce téléphone"
        variant="secondary"
        onPress={() => {
          updateSettings({ mode: null });
          router.replace('/');
        }}
      />
      <Button title="Tout effacer" variant="danger" onPress={reset} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 14, paddingBottom: 48 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  text: { fontSize: 15, lineHeight: 22, color: colors.ink },
});
