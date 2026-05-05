import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '../constants/Theme';

interface ChainSwitcherProps {
  selectedChain: string;
  onSelect: (chain: string) => void;
}

export default function ChainSwitcher({ selectedChain, onSelect }: ChainSwitcherProps) {
  const chains = [
    { id: 'ETH', name: 'Ethereum', color: '#627EEA' },
    { id: 'POLYGON', name: 'Polygon', color: '#8247E5' },
    { id: 'BSC', name: 'Binance', color: '#F3BA2F' }
  ];

  return (
    <View style={styles.container}>
      {chains.map((chain) => (
        <TouchableOpacity 
          key={chain.id}
          style={[
            styles.chip, 
            selectedChain === chain.id && { backgroundColor: chain.color + '20', borderColor: chain.color }
          ]}
          onPress={() => onSelect(chain.id)}
        >
          <View style={[styles.dot, { backgroundColor: chain.color }]} />
          <Text style={[styles.text, selectedChain === chain.id && { color: chain.color }]}>
            {chain.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: SPACING.m,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});
