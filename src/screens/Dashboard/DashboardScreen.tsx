import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import PortfolioChart from '../../components/PortfolioChart';
import TextIcon from '../../components/TextIcon';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { useAccountStore } from '../../store/walletStore';

const chartData = [10300, 10840, 10520, 11280, 11740, 11490, 12482];
const holdings = [
  { symbol: 'BTC', name: 'Bitcoin', allocation: '42%', value: '$5,242.88', change: '+2.8%' },
  { symbol: 'ETH', name: 'Ethereum', allocation: '31%', value: '$3,869.48', change: '+5.4%' },
  { symbol: 'USDC', name: 'USD Coin', allocation: '18%', value: '$2,246.80', change: '+0.0%' },
];

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { name } = useAccountStore();

  const QuickAction = ({ icon, label, onPress }: any) => (
    <TouchableOpacity style={styles.action} onPress={onPress} activeOpacity={0.82}>
      <TextIcon label={icon} size={21} color={COLORS.primaryLight} />
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good evening, {name}</Text>
            <Text style={styles.headerSubtext}>AI-managed digital asset banking</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <TextIcon label="!" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <LinearGradient colors={['rgba(10,132,255,0.34)', 'rgba(16,24,42,0.96)']} style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroPill}>
              <TextIcon label="B" size={14} color={COLORS.primaryLight} />
              <Text style={styles.heroPillText}>Custodial account</Text>
            </View>
            <TextIcon label="O" size={18} color={COLORS.textSecondary} />
          </View>
          <Text style={styles.balanceLabel}>Portfolio value</Text>
          <Text style={styles.balance}>$12,482.20</Text>
          <View style={styles.gainRow}>
            <TextIcon label="+" size={16} color={COLORS.success} />
            <Text style={styles.gainText}>+4.21% today</Text>
          </View>
        </LinearGradient>

        <View style={styles.actionRow}>
          <QuickAction icon=">" label="Send" onPress={() => navigation.navigate('Send')} />
          <QuickAction icon="<" label="Deposit" onPress={() => navigation.navigate('Receive')} />
          <QuickAction icon="#" label="Card" onPress={() => {}} />
        </View>

        <View style={styles.chartCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Wealth curve</Text>
            <Text style={styles.sectionMeta}>7D</Text>
          </View>
          <PortfolioChart data={chartData} />
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <TextIcon label="AI" size={17} color={COLORS.primaryLight} />
          </View>
          <View style={styles.insightCopy}>
            <Text style={styles.insightTitle}>Your portfolio risk increased by 12% this week.</Text>
            <Text style={styles.insightText}>Gemini intelligence detected higher ETH concentration after the latest market move.</Text>
          </View>
        </View>

        <View style={styles.trustRow}>
          <View style={styles.trustItem}>
            <TextIcon label="OK" size={14} color={COLORS.success} />
            <Text style={styles.trustText}>MPC-ready custody</Text>
          </View>
          <View style={styles.trustItem}>
            <TextIcon label="*" size={18} color={COLORS.primaryLight} />
            <Text style={styles.trustText}>AI monitoring</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Allocation</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Portfolio')}>
            <Text style={styles.linkText}>Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.holdings}>
          {holdings.map((item) => (
            <View key={item.symbol} style={styles.holdingRow}>
              <View style={styles.assetMark}>
                <Text style={styles.assetMarkText}>{item.symbol[0]}</Text>
              </View>
              <View style={styles.assetInfo}>
                <Text style={styles.assetName}>{item.name}</Text>
                <Text style={styles.assetMeta}>{item.allocation} allocation</Text>
              </View>
              <View style={styles.assetValue}>
                <Text style={styles.assetAmount}>{item.value}</Text>
                <Text style={styles.assetChange}>{item.change}</Text>
              </View>
            </View>
          ))}
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
  content: {
    padding: SPACING.l,
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  greeting: {
    ...TYPOGRAPHY.h2,
    fontSize: 22,
  },
  headerSubtext: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: 28,
    padding: SPACING.l,
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.18)',
    marginBottom: SPACING.m,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  heroPillText: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },
  balanceLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
  },
  balance: {
    ...TYPOGRAPHY.balance,
    fontSize: 44,
    marginTop: 6,
  },
  gainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.s,
  },
  gainText: {
    color: COLORS.success,
    fontWeight: '800',
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.m,
    marginBottom: SPACING.l,
  },
  action: {
    flex: 1,
    minHeight: 72,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  actionText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
  },
  sectionMeta: {
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  insightCard: {
    flexDirection: 'row',
    gap: SPACING.m,
    padding: SPACING.m,
    borderRadius: 22,
    backgroundColor: 'rgba(10,132,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.16)',
    marginBottom: SPACING.m,
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(10,132,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightCopy: {
    flex: 1,
  },
  insightTitle: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: 15,
    lineHeight: 21,
  },
  insightText: {
    color: COLORS.textSecondary,
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
  },
  trustRow: {
    flexDirection: 'row',
    gap: SPACING.m,
    marginBottom: SPACING.l,
  },
  trustItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: SPACING.m,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  trustText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  linkText: {
    color: COLORS.primaryLight,
    fontWeight: '700',
  },
  holdings: {
    gap: SPACING.s,
  },
  holdingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  assetMark: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: 'rgba(10,132,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  assetMarkText: {
    color: COLORS.primaryLight,
    fontWeight: '900',
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  assetMeta: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  assetValue: {
    alignItems: 'flex-end',
  },
  assetAmount: {
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  assetChange: {
    color: COLORS.success,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '700',
  },
});
