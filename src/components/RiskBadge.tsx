import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/Theme';

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high';
}

export default function RiskBadge({ level }: RiskBadgeProps) {
  const color = {
    low: COLORS.success,
    medium: COLORS.warning,
    high: COLORS.error,
  }[level];

  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
      <Text style={[styles.text, { color }]}>
        Risk: {level.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
