import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { TimesEditor } from '@/components/TimesEditor';
import { Button, Card } from '@/components/ui';
import { analyserOrdonnance, DEMO_OCR, type DraftMed } from '@/lib/ordonnance';
import { useStore } from '@/lib/store';
import { colors, radius } from '@/theme';

type Phase = 'pick' | 'analyzing' | 'review';

export default function ScanScreen() {
  const { addMeds } = useStore();
  const [phase, setPhase] = useState<Phase>('pick');
  const [uri, setUri] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<DraftMed[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pick = async (source: 'camera' | 'library') => {
    setError(null);
    try {
      if (source === 'camera') {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          setError("L'accès à l'appareil photo est nécessaire pour scanner l'ordonnance.");
          return;
        }
      }
      const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.7 };
      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);
      if (result.canceled || !result.assets[0]) return;
      const imageUri = result.assets[0].uri;
      setUri(imageUri);
      setPhase('analyzing');
      setDrafts(await analyserOrdonnance(imageUri));
      setPhase('review');
    } catch {
      setError("Impossible d'ouvrir l'appareil photo. Essayez depuis la galerie.");
      setPhase('pick');
    }
  };

  const update = (key: string, patch: Partial<DraftMed>) =>
    setDrafts((ds) => ds.map((d) => (d.key === key ? { ...d, ...patch } : d)));

  const kept = drafts.filter((d) => d.keep && d.name.trim() && d.times.length);

  const validate = () => {
    addMeds(kept.map(({ key: _k, keep: _keep, ...m }) => ({ ...m, name: m.name.trim() })));
    router.back();
  };

  if (phase === 'pick') {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.h1}>Une photo suffit</Text>
        <Text style={styles.lead}>
          Posez l'ordonnance à plat, bien éclairée. PilulAmi remplit le planning des prises, puis vous vérifiez
          chaque ligne.
        </Text>
        <View style={styles.illustration}>
          <Text style={{ fontSize: 64 }}>📄</Text>
        </View>
        <Button title="📷  Prendre une photo" onPress={() => pick('camera')} />
        <Button title="Choisir dans la galerie" variant="secondary" onPress={() => pick('library')} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    );
  }

  if (phase === 'analyzing') {
    return (
      <View style={[styles.container, styles.center]}>
        {uri ? <Image source={{ uri }} style={styles.preview} /> : null}
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.lead}>Lecture de l'ordonnance…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.reviewHead}>
        {uri ? <Image source={{ uri }} style={styles.thumb} /> : null}
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.h2}>Vérifiez le planning</Text>
          <Text style={styles.small}>Comparez avec l'ordonnance et corrigez si besoin avant de valider.</Text>
        </View>
      </View>
      {DEMO_OCR ? (
        <View style={styles.demo}>
          <Text style={styles.demoText}>Mode démo : la lecture automatique est simulée dans ce prototype.</Text>
        </View>
      ) : null}

      {drafts.map((d) => (
        <Card key={d.key} style={[{ gap: 10 }, !d.keep && { opacity: 0.5 }]}>
          <View style={styles.draftHead}>
            <TextInput
              value={d.name}
              onChangeText={(name) => update(d.key, { name })}
              style={styles.draftName}
              placeholder="Nom du médicament"
            />
            <Pressable onPress={() => update(d.key, { keep: !d.keep })} hitSlop={8}>
              <Text style={[styles.keep, { color: d.keep ? colors.danger : colors.primary }]}>
                {d.keep ? 'Retirer' : 'Garder'}
              </Text>
            </Pressable>
          </View>
          {d.keep ? (
            <>
              <TextInput
                value={d.dosage}
                onChangeText={(dosage) => update(d.key, { dosage })}
                style={styles.draftInput}
                placeholder="Dose"
              />
              <TextInput
                value={d.instructions ?? ''}
                onChangeText={(instructions) => update(d.key, { instructions })}
                style={styles.draftInput}
                placeholder="Consigne"
              />
              <TimesEditor value={d.times} onChange={(times) => update(d.key, { times })} />
            </>
          ) : null}
        </Card>
      ))}

      <Button
        title={`Valider ${kept.length} médicament${kept.length > 1 ? 's' : ''}`}
        disabled={kept.length === 0}
        onPress={validate}
      />
      <Button title="Reprendre la photo" variant="ghost" onPress={() => setPhase('pick')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 14, paddingBottom: 48, flexGrow: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  h1: { fontSize: 28, fontWeight: '800', color: colors.ink },
  h2: { fontSize: 20, fontWeight: '800', color: colors.ink },
  lead: { fontSize: 17, lineHeight: 24, color: colors.muted },
  small: { fontSize: 14, lineHeight: 20, color: colors.muted },
  error: { color: colors.danger, fontSize: 15, textAlign: 'center' },
  illustration: {
    height: 160,
    borderRadius: radius.l,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  preview: { width: 200, height: 260, borderRadius: radius.m, marginBottom: 16 },
  reviewHead: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  thumb: { width: 64, height: 84, borderRadius: radius.s, backgroundColor: colors.line },
  demo: { backgroundColor: colors.warningSoft, borderRadius: radius.m, padding: 12 },
  demoText: { color: colors.warning, fontSize: 14, fontWeight: '600' },
  draftHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  draftName: { flex: 1, fontSize: 18, fontWeight: '700', color: colors.ink, paddingVertical: 4 },
  keep: { fontSize: 14, fontWeight: '700' },
  draftInput: {
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.s,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 15,
    color: colors.ink,
  },
});
