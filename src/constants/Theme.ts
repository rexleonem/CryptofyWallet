export const COLORS = {
  background: '#0B0F1A',
  card: '#161C2C',
  cardSecondary: '#1F2937',
  primary: '#4F7CFF',
  primaryLight: '#7BA0FF',
  secondary: '#10B981',
  accent: '#F59E0B',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  border: '#2D3748',
  white: '#FFFFFF',
  black: '#000000',
  gradientStart: '#4F7CFF',
  gradientEnd: '#3352B5',
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: COLORS.textPrimary,
    lineHeight: 28,
  },
  balance: {
    fontSize: 42,
    fontWeight: '800' as const,
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  body: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  small: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: COLORS.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
};
