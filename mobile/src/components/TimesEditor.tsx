import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip } from '@/components/ui';
import { formatHM, isValidHM, normalizeHM } from '@/lib/schedule';
import { colors, radius } from '@/theme';

const PRESETS = [
  { label: 'Matin', time: '08:00' },
  { label: 'Midi', time: '12:30' },
  { label: 'Soir', time: '19:30' },
  { label: 'Coucher', time: '22:00' },
];

export function TimesEditor({ value, onChange }: { value: string[]; onChange: (times: string[]) => void }) {
  const [custom, setCustom] = useState('');
  const toggle = (t: string) =>
    onChange(value.includes(t) ? value.filter((x) => x !== t) : [...value, t].sort());

  const addCustom = () => {
    if (!isValidHM(custom)) return;
    const t = normalizeHM(custom);
    if (!value.includes(t)) onChange([...value, t].sort());
    setCustom('');
  };

  const extra = value.filter((t) => !PRESETS.some((p) => p.time === t));

  return (
    <View style={{ gap: 10 }}>
      <View style={styles.row}>
        {PRESETS.map((p) => (
          <Chip
            key={p.time}
            label={`${p.label} · ${formatHM(p.time)}`}
            selected={value.includes(p.time)}
            onPress={() => toggle(p.time)}
          />
        ))}
        {extra.map((t) => (
          <Chip key={t} label={`${formatHM(t)}  ✕`} selected onPress={() => toggle(t)} />
        ))}
      </View>
      <View style={styles.customRow}>
        <TextInput
          value={custom}
          onChangeText={setCustom}
          placeholder="Autre heure (ex. 07:15)"
          placeholderTextColor="#9AA3A1"
          keyboardType="numbers-and-punctuation"
          maxLength={5}
          onSubmitEditing={addCustom}
          style={styles.input}
        />
        <Pressable
          onPress={addCustom}
          disabled={!isValidHM(custom)}
          style={[styles.add, !isValidHM(custom) && { opacity: 0.4 }]}
        >
          <Text style={styles.addText}>Ajouter</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  customRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.m,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.ink,
  },
  add: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: radius.m,
    backgroundColor: colors.primarySoft,
  },
  addText: { color: colors.primary, fontWeight: '700', fontSize: 15 },
});
