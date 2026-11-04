import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Field } from '@/components/ui';
import { ensurePermission } from '@/lib/notifications';
import { useStore } from '@/lib/store';
import type { Mode } from '@/lib/types';
import { colors, radius } from '@/theme';

export default function Welcome() {
  const { loaded, settings, updateSettings } = useStore();

  if (!loaded) {
    return (
      <View style={[styles.flex, styles.center]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  if (settings.onboarded && settings.mode) {
    return <Redirect href={settings.mode === 'senior' ? '/senior' : '/aidant'} />;
  }

  const choose = async (mode: Mode) => {
    await ensurePermission();
    updateSettings({ mode });
    router.replace(mode === 'senior' ? '/senior' : '/aidant');
  };

  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.logo}>
            <Text style={styles.logoPill}>💊</Text>
          </View>
          <Text style={styles.brand}>PilulAmi</Text>
          {settings.onboarded ? (
            <ChooseMode onChoose={choose} seniorName={settings.seniorName} />
          ) : (
            <Onboarding />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Onboarding() {
  const { settings, updateSettings } = useStore();
  const [seniorName, setSeniorName] = useState(settings.seniorName);
  const [aidantName, setAidantName] = useState(settings.aidantName);

  return (
    <View style={{ gap: 18 }}>
      <Text style={styles.title}>Sachez que votre proche a bien pris ses médicaments.</Text>
      <Text style={styles.lead}>
        PilulAmi lui rappelle chaque prise avec un seul bouton, et vous prévient en cas d'oubli. Simple pour lui,
        rassurant pour vous.
      </Text>
      <Field
        label="Comment appelez-vous votre proche ?"
        value={seniorName}
        onChangeText={setSeniorName}
        placeholder="Maman, Papa, Jeanne…"
      />
      <Field
        label="Votre prénom"
        hint="Affiché sur l'écran de votre proche : « Sophie est prévenue »."
        value={aidantName}
        onChangeText={setAidantName}
        placeholder="Sophie"
      />
      <Button
        title="Commencer"
        disabled={!seniorName.trim()}
        onPress={() =>
          updateSettings({ seniorName: seniorName.trim(), aidantName: aidantName.trim(), onboarded: true })
        }
      />
      <Text style={styles.disclaimer}>
        PilulAmi aide à suivre un traitement. Il ne remplace pas l'avis d'un médecin ou d'un pharmacien.
      </Text>
    </View>
  );
}

function ChooseMode({ onChoose, seniorName }: { onChoose: (m: Mode) => void; seniorName: string }) {
  return (
    <View style={{ gap: 16 }}>
      <Text style={styles.title}>Qui utilise ce téléphone ?</Text>
      <ModeCard
        emoji="👵"
        title={`C'est le téléphone de ${seniorName}`}
        text="Un écran très simple : un rappel et un grand bouton « J'ai pris mon médicament »."
        onPress={() => onChoose('senior')}
      />
      <ModeCard
        emoji="🧑‍💼"
        title="C'est mon téléphone (aidant)"
        text="Configurez le traitement, scannez l'ordonnance et suivez la journée en un coup d'œil."
        onPress={() => onChoose('aidant')}
      />
    </View>
  );
}

function ModeCard(props: { emoji: string; title: string; text: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={props.onPress}
      style={({ pressed }) => [styles.modeCard, pressed && { borderColor: colors.primary }]}
    >
      <Text style={{ fontSize: 34 }}>{props.emoji}</Text>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={styles.modeTitle}>{props.title}</Text>
        <Text style={styles.modeText}>{props.text}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  container: { padding: 24, paddingTop: 32, gap: 8 },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPill: { fontSize: 32 },
  brand: { fontSize: 18, fontWeight: '800', color: colors.primary, marginTop: 10, marginBottom: 14 },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '800', color: colors.ink, letterSpacing: -0.6 },
  lead: { fontSize: 17, lineHeight: 25, color: colors.muted },
  disclaimer: { fontSize: 13, lineHeight: 19, color: colors.muted, textAlign: 'center' },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    backgroundColor: colors.card,
    borderRadius: radius.l,
    borderWidth: 2,
    borderColor: colors.line,
  },
  modeTitle: { fontSize: 18, fontWeight: '700', color: colors.ink },
  modeText: { fontSize: 15, lineHeight: 21, color: colors.muted },
  chevron: { fontSize: 30, color: colors.muted },
});
