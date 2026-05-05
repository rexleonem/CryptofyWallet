import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/Theme';

interface ProfitBadgeProps {
  percentage: number;
}

export default function ProfitBadge({ percentage }: ProfitBadgeProps) {
  const isProfit = percentage >= 0;
  const color = isProfit ? COLORS.success : COLORS.error;

  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
      <Text style={[styles.text, { color }]}>
        {isProfit ? '+' : ''}{percentage}%
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
