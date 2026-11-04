import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';

import { TimesEditor } from '@/components/TimesEditor';
import { Button, Field } from '@/components/ui';
import { useStore } from '@/lib/store';
import { colors } from '@/theme';

export default function MedicamentForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { meds, saveMed, deleteMed } = useStore();
  const existing = meds.find((m) => m.id === id);

  const [name, setName] = useState(existing?.name ?? '');
  const [dosage, setDosage] = useState(existing?.dosage ?? '1 comprimé');
  const [instructions, setInstructions] = useState(existing?.instructions ?? '');
  const [times, setTimes] = useState<string[]>(existing?.times ?? ['08:00']);

  const valid = name.trim().length > 0 && times.length > 0;

  const save = () => {
    saveMed({
      id: existing?.id,
      name: name.trim(),
      dosage: dosage.trim(),
      instructions: instructions.trim() || undefined,
      times,
    });
    router.back();
  };

  const remove = () => {
    if (!existing) return;
    const doIt = () => {
      deleteMed(existing.id);
      router.back();
    };
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.(`Supprimer ${existing.name} ?`)) doIt();
      return;
    }
    Alert.alert('Supprimer', `Retirer ${existing.name} du traitement ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: doIt },
    ]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: existing ? 'Modifier' : 'Nouveau médicament' }} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Field label="Nom du médicament" value={name} onChangeText={setName} placeholder="Doliprane 1000 mg" autoFocus={!existing} />
        <Field label="Dose" value={dosage} onChangeText={setDosage} placeholder="1 comprimé" />
        <Field
          label="Consigne (facultatif)"
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Pendant le repas, à jeun…"
        />
        <Text style={styles.label}>Heures de prise</Text>
        <TimesEditor value={times} onChange={setTimes} />
        <Button title={existing ? 'Enregistrer' : 'Ajouter au traitement'} disabled={!valid} onPress={save} style={{ marginTop: 8 }} />
        {existing ? <Button title="Supprimer ce médicament" variant="danger" onPress={remove} /> : null}
        <Text style={styles.disclaimer}>Recopiez les informations de l'ordonnance. En cas de doute, demandez au pharmacien.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16, paddingBottom: 48 },
  label: { fontSize: 15, fontWeight: '600', color: colors.ink },
  disclaimer: { fontSize: 13, color: colors.muted, textAlign: 'center', lineHeight: 19 },
});
