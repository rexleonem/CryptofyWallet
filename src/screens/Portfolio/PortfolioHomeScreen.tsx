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
  StatusBar,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../../store/walletStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { fetchPortfolioSummary, fetchPortfolioHistory, PortfolioSummary } from '../../api/portfolio';
import PortfolioChart from '../../components/PortfolioChart';
import TokenRow from '../../components/TokenRow';
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
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [timeFilter, setTimeFilter] = useState('7D');

  const fetchData = async () => {
    if (!address) return;
    try {
      const [summary, historyData] = await Promise.all([
        fetchPortfolioSummary(address),
        fetchPortfolioHistory(address)
      ]);
      
      setPortfolio(summary);
      setHistory(historyData);
    } catch (error) {
      console.error('Portfolio Fetch Error:', error);
      Alert.alert('Sync Error', 'Unable to fetch latest portfolio data.');
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

  const change = portfolio?.change24h || 0;
  const isPositive = change >= 0;
  const tokens = portfolio?.tokens || [];

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
            <View style={[styles.badge, { backgroundColor: isPositive ? `${COLORS.success}15` : `${COLORS.error}15` }]}>
              {isPositive ? <TrendingUp size={14} color={COLORS.success} /> : <TrendingDown size={14} color={COLORS.error} />}
              <Text style={[styles.badgeText, { color: isPositive ? COLORS.success : COLORS.error }]}>
                {isPositive ? '+' : ''}{change}%
              </Text>
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
          <PortfolioChart data={history && history.length > 0 ? history : [0, 0, 0]} />
        </View>

        <View style={styles.aiSection}>
          <View style={styles.sectionHeaderRow}>
            <Sparkles size={20} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>AI Insights</Text>
          </View>
          <TouchableOpacity 
            style={styles.insightCard}
            onPress={() => navigation.navigate('InsightsDetail')}
          >
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Portfolio Diversification</Text>
              <Text style={styles.insightMessage}>Consider diversifying your assets across different chains for better risk management.</Text>
            </View>
            <ArrowUpRight size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Target size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Asset Allocation</Text>
        </View>

        <View style={styles.assetsList}>
          {tokens.map((token: any, i: number) => (
            <TokenRow 
              key={`${token.symbol}-${i}`}
              symbol={token.symbol || '???'}
              name={token.name || 'Unknown Token'}
              amount={token.amount || '0'}
              value={token.value || '0'}
              change24h={token.change24h || 0}
              onPress={() => navigation.navigate('TokenDetail', { token })}
            />
          ))}
        </View>

        {tokens.length === 0 && (
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
