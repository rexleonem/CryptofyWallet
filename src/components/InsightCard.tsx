import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/Theme';

interface InsightCardProps {
  type: string;
  title: string;
  message: string;
  severity: string;
  onAction?: () => void;
}

export default function InsightCard({ type, title, message, severity, onAction }: InsightCardProps) {
  const getSeverityColor = () => {
    switch (severity) {
      case 'warning': return COLORS.warning;
      case 'critical': return COLORS.error;
      case 'positive': return COLORS.success;
      default: return COLORS.primary;
    }
  };

  const color = getSeverityColor();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.indicator, { backgroundColor: color }]} />
        <Text style={[styles.title, { color }]}>{title}</Text>
      </View>
      
      <Text style={styles.message}>{message}</Text>
      
      <TouchableOpacity style={styles.actionBtn} onPress={onAction}>
        <Text style={styles.actionText}>Review Recommendation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.l,
    marginBottom: SPACING.l,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    ...TYPOGRAPHY.body,
    lineHeight: 22,
    marginBottom: SPACING.l,
  },
  actionBtn: {
    backgroundColor: 'rgba(79, 124, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
