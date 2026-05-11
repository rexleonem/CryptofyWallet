import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  RefreshControl, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../../store/walletStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { CURRENCIES } from '../../constants/Currencies';
import PortfolioChart from '../../components/PortfolioChart';
import TokenRow from '../../components/TokenRow';
import ProfitBadge from '../../components/ProfitBadge';
import InsightStrip from '../../components/InsightStrip';
import Skeleton from '../../components/Skeleton';
import ChainSwitcher from '../../components/ChainSwitcher';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Target, 
  ArrowUpRight,
  Filter
} from 'lucide-react-native';

export default function PortfolioHomeScreen() {
  const navigation = useNavigation<any>();
  const { address } = useWalletStore();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [selectedChain, setSelectedChain] = useState('ETH');
  const [timeFilter, setTimeFilter] = useState('7D');

  const fetchData = async () => {
    if (!address) return;
    try {
      // Mocking portfolio data
      const mockSummary = {
        totalValue: '4825.40',
        change24h: 5.24,
        tokens: [
          { symbol: 'ETH', name: 'Ethereum', amount: '1.24', value: '3240.00', change24h: 3.2 },
          { symbol: 'CFYC', name: 'Cryptofy Coin', amount: '1250.00', value: '125.00', change24h: 12.5 },
          { symbol: 'CHUSD', name: 'Cherokee USD', amount: '100.00', value: '100.00', change24h: 0.1 },
        ]
      };
      
      setPortfolio(mockSummary);
      setHistory([3000, 3100, 3050, 3200, 3400, 3350, 3450]);
      setAiInsight({
        title: 'Portfolio Diversification',
        message: 'Your exposure to ETH is high. Consider diversifying into CFYC for potential high growth.',
        severity: 'info'
      });
    } catch (error) {
      console.error('Portfolio Fetch Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [address]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading Portfolio...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={TYPOGRAPHY.h2}>Portfolio</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={18} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Net Worth</Text>
          <Text style={styles.summaryValue}>${parseFloat(portfolio?.totalValue || '0').toLocaleString()}</Text>
          <View style={styles.performanceRow}>
            <View style={[styles.badge, { backgroundColor: `${COLORS.success}15` }]}>
              <TrendingUp size={14} color={COLORS.success} />
              <Text style={[styles.badgeText, { color: COLORS.success }]}>+${portfolio?.change24h}%</Text>
            </View>
            <Text style={styles.performancePeriod}>last 24 hours</Text>
          </View>
        </View>

        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <View style={styles.timeFilters}>
              {['24H', '7D', '30D', '1Y', 'ALL'].map(f => (
                <TouchableOpacity 
                  key={f} 
                  style={[styles.filterBtn, timeFilter === f && styles.activeFilter]}
                  onPress={() => setTimeFilter(f)}
                >
                  <Text style={[styles.filterText, timeFilter === f && styles.activeFilterText]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <PortfolioChart data={history.length > 0 ? history : [0, 0, 0]} />
        </View>

        <View style={styles.aiSection}>
          <View style={styles.sectionHeaderRow}>
            <Sparkles size={20} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>AI Insights</Text>
          </View>
          {aiInsight && (
            <TouchableOpacity 
              style={styles.insightCard}
              onPress={() => navigation.navigate('InsightsDetail')}
            >
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{aiInsight.title}</Text>
                <Text style={styles.insightMessage}>{aiInsight.message}</Text>
              </View>
              <ArrowUpRight size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionHeaderRow}>
          <Target size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Asset Allocation</Text>
        </View>

        <View style={styles.assetsList}>
          {portfolio?.tokens.map((token: any, i: number) => (
            <TokenRow 
              key={i}
              symbol={token.symbol}
              name={token.name}
              amount={token.amount}
              value={token.value}
              change24h={token.change24h}
              onPress={() => navigation.navigate('TokenDetail', { token })}
            />
          ))}
        </View>

        {!portfolio?.tokens.length && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No assets yet</Text>
            <Text style={styles.emptySubtitle}>Your portfolio will appear here once you receive crypto.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.small,
    marginTop: SPACING.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scrollContent: {
    padding: SPACING.l,
  },
  summaryCard: {
    marginBottom: SPACING.xl,
  },
  summaryLabel: {
    ...TYPOGRAPHY.label,
    marginBottom: 4,
  },
  summaryValue: {
    ...TYPOGRAPHY.balance,
    fontSize: 36,
  },
  performanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.s,
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  performancePeriod: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
  },
  chartSection: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: SPACING.m,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chartHeader: {
    marginBottom: SPACING.m,
  },
  timeFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 4,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeFilter: {
    backgroundColor: COLORS.cardSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterText: {
    ...TYPOGRAPHY.small,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  activeFilterText: {
    color: COLORS.textPrimary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
  },
  aiSection: {
    marginBottom: SPACING.xl,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}10`,
    padding: SPACING.m,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
  },
  insightContent: {
    flex: 1,
    marginRight: SPACING.s,
  },
  insightTitle: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 15,
    color: COLORS.primaryLight,
    marginBottom: 4,
  },
  insightMessage: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
  assetsList: {
    gap: SPACING.s,
    marginBottom: SPACING.xxl,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: 8,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    color: COLORS.textMuted,
  },
});
