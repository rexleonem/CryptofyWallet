import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/Theme';

interface GasEstimateCardProps {
  estimates: {
    slow: string;
    standard: string;
    fast: string;
  };
  selected: 'slow' | 'standard' | 'fast';
  onSelect: (speed: 'slow' | 'standard' | 'fast') => void;
}

export default function GasEstimateCard({ estimates, selected, onSelect }: GasEstimateCardProps) {
  const speeds: Array<'slow' | 'standard' | 'fast'> = ['slow', 'standard', 'fast'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estimated Gas Fee</Text>
      <View style={styles.row}>
        {speeds.map((speed) => (
          <TouchableOpacity
            key={speed}
            style={[
              styles.option,
              selected === speed && styles.selectedOption
            ]}
            onPress={() => onSelect(speed)}
          >
            <View style={[styles.dot, { backgroundColor: getSpeedColor(speed) }]} />
            <Text style={styles.speedLabel}>{speed.charAt(0).toUpperCase() + speed.slice(1)}</Text>
            <Text style={styles.feeText}>{estimates[speed].split(' ')[0]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const getSpeedColor = (speed: string) => {
  switch (speed) {
    case 'slow': return COLORS.textSecondary;
    case 'standard': return COLORS.primary;
    case 'fast': return COLORS.success;
    default: return COLORS.textSecondary;
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.m,
    marginVertical: SPACING.m,
  },
  title: {
    ...TYPOGRAPHY.small,
    fontWeight: 'bold',
    marginBottom: SPACING.m,
    color: COLORS.textPrimary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flex: 0.31,
    padding: SPACING.base,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  selectedOption: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(79, 124, 255, 0.1)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  speedLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  feeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
});
