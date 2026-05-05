export const COLORS = {
  background: '#0B0F1A',
  card: '#121826',
  primary: '#4F7CFF',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
};

export const SPACING = {
  base: 8,
  m: 16,
  l: 24,
  xl: 32,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: COLORS.textPrimary,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: COLORS.textPrimary,
  },
  balance: {
    fontSize: 42,
    fontWeight: '800' as const,
    color: COLORS.textPrimary,
  },
  body: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  small: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
};
