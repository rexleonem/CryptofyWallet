import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import ProfitBadge from '../../components/ProfitBadge';
import PortfolioChart from '../../components/PortfolioChart';

export default function TokenDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { token } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{token.name} ({token.symbol})</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Text style={styles.price}>${parseFloat(token.price).toLocaleString()}</Text>
          <ProfitBadge percentage={token.change24h} />
        </View>

        <PortfolioChart data={[parseFloat(token.price), parseFloat(token.price), parseFloat(token.price)]} />

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Holdings</Text>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Quantity</Text>
            <Text style={styles.statValue}>{token.amount} {token.symbol}</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Current Value</Text>
            <Text style={styles.statValue}>${parseFloat(token.value).toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: COLORS.primary }]}
            onPress={() => navigation.navigate('Send', { asset: token.symbol })}
          >
            <Text style={styles.actionBtnText}>Send {token.symbol}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: COLORS.card, marginTop: SPACING.m }]}
            onPress={() => navigation.navigate('P2PMarketplace', { asset: token.symbol })}
          >
            <Text style={styles.actionBtnText}>Sell via P2P</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.m,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 18,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  scrollContent: {
    padding: SPACING.l,
  },
  hero: {
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  price: {
    ...TYPOGRAPHY.balance,
    fontSize: 30,
    marginBottom: 8,
  },
  statsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.l,
    marginBottom: SPACING.xl,
  },
  statsTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 18,
    marginBottom: SPACING.m,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    marginBottom: SPACING.xl,
  },
  actionBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
