export const colors = {
  bg: '#FBF7F0',
  card: '#FFFFFF',
  ink: '#1D2B2A',
  muted: '#5E6B69',
  line: '#E7E0D4',
  primary: '#0F5C55',
  primarySoft: '#DCEBE7',
  success: '#2E7D4F',
  successSoft: '#E1F2E7',
  warning: '#B26A00',
  warningSoft: '#FFF0D6',
  danger: '#B3261E',
  dangerSoft: '#FBE3E1',
  accent: '#E8765A',
};

export const radius = { s: 10, m: 16, l: 24, xl: 32 };

export const statusStyle = {
  taken: { label: 'Pris', fg: colors.success, bg: colors.successSoft, icon: '✓' },
  upcoming: { label: 'À venir', fg: colors.muted, bg: '#F1ECE3', icon: '◷' },
  due: { label: 'En attente', fg: colors.warning, bg: colors.warningSoft, icon: '…' },
  missed: { label: 'Non confirmé', fg: colors.danger, bg: colors.dangerSoft, icon: '!' },
} as const;
