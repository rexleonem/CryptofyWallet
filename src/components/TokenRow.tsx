import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/Theme';
import ProfitBadge from './ProfitBadge';

interface TokenRowProps {
  symbol: string;
  name: string;
  amount: string;
  value: string;
  change24h: number;
  onPress: () => void;
}

export default function TokenRow({ symbol, name, amount, value, change24h, onPress }: TokenRowProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{symbol[0]}</Text>
      </View>
      
      <View style={styles.mainInfo}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.amount}>{amount} {symbol}</Text>
      </View>

      <View style={styles.valueInfo}>
        <Text style={styles.value}>${parseFloat(value).toLocaleString()}</Text>
        <ProfitBadge percentage={change24h} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3C3C3D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  iconText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainInfo: {
    flex: 1,
  },
  name: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  amount: {
    ...TYPOGRAPHY.small,
    marginTop: 2,
  },
  valueInfo: {
    alignItems: 'flex-end',
  },
  value: {
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
});
