import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/Theme';

interface InsightStripProps {
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'neutral' | 'positive' | string;
  onPress: () => void;
}

export default function InsightStrip({ title, message, severity, onPress }: InsightStripProps) {
  const color = {
    critical: COLORS.error,
    warning: COLORS.warning,
    positive: COLORS.success,
    neutral: COLORS.textSecondary,
  }[severity] || COLORS.primary;

  return (
    <TouchableOpacity 
      style={[styles.container, { borderLeftColor: color }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color }]}>{title}</Text>
        <Text style={styles.message} numberOfLines={1}>{message}</Text>
      </View>
      <Text style={[styles.arrow, { color }]}>→</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    marginVertical: SPACING.m,
    padding: SPACING.m,
    borderRadius: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  message: {
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  arrow: {
    fontSize: 18,
    marginLeft: SPACING.m,
  },
});
