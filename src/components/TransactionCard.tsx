import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/Theme';

interface TransactionCardProps {
  type: 'send' | 'receive';
  address: string;
  amount: string;
  symbol?: string | null;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
}

export default function TransactionCard({ type, address, amount, symbol, status, timestamp }: TransactionCardProps) {
  const isSend = type === 'send';
  
  const statusColor = {
    pending: COLORS.warning,
    confirmed: COLORS.success,
    failed: COLORS.error,
  }[status];

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: isSend ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)' }]}>
        <Text style={[styles.icon, { color: isSend ? COLORS.error : COLORS.success }]}>
          {isSend ? '↑' : '↓'}
        </Text>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.typeText}>{isSend ? 'Sent' : 'Received'}</Text>
        <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">{address}</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amountText, { color: isSend ? COLORS.textPrimary : COLORS.success }]}>
          {isSend ? '-' : '+'}{amount}{symbol ? ` ${symbol}` : ''}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.m,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  icon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  typeText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  addressText: {
    ...TYPOGRAPHY.small,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
