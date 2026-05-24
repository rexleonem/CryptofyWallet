export const COLORS = {
  background: '#050816',
  card: '#10182A',
  cardSecondary: '#172033',
  primary: '#0A84FF',
  primaryLight: '#A5D8FF',
  secondary: '#10B981',
  accent: '#F59E0B',
  textPrimary: '#FFFFFF',
  textSecondary: '#B6C2D9',
  textMuted: '#7D8BA7',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  border: '#20304D',
  white: '#FFFFFF',
  black: '#000000',
  gradientStart: '#0A84FF',
  gradientEnd: '#2563EB',
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 14,
  l: 18,
  xl: 24,
  xxl: 36,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    lineHeight: 34,
  },
  h2: {
    fontSize: 21,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  balance: {
    fontSize: 34,
    fontWeight: '800' as const,
    color: COLORS.textPrimary,
    letterSpacing: 0,
  },
  body: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.textPrimary,
    lineHeight: 20,
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
