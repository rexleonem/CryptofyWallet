import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../../store/walletStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import PortfolioChart from '../../components/PortfolioChart';
import TokenRow from '../../components/TokenRow';
import ProfitBadge from '../../components/ProfitBadge';
import InsightStrip from '../../components/InsightStrip';
import Skeleton from '../../components/Skeleton';
import ChainSwitcher from '../../components/ChainSwitcher';

export default function PortfolioHomeScreen() {
  const navigation = useNavigation<any>();
  const { address } = useWalletStore();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [selectedChain, setSelectedChain] = useState('ETH');

  const fetchData = async () => {
    if (!address) return;
    try {
      const [summaryRes, historyRes, aiRes] = await Promise.all([
        fetch(`http://localhost:3000/portfolio/${address}`),
        fetch(`http://localhost:3000/portfolio/history/${address}`),
        fetch(`http://localhost:3000/ai/portfolio/${address}`)
      ]);
      
      const summary = await summaryRes.json();
      const hist = await historyRes.json();
      const ai = await aiRes.json();
      
      setPortfolio(summary);
      setHistory(hist.map((h: any) => h.value));
      setAiInsight(ai.insights?.[0] || null);
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
        <View style={styles.scrollContent}>
          <View style={styles.header}>
            <Skeleton width={120} height={30} />
            <Skeleton width={60} height={20} />
          </View>
          <View style={{ alignItems: 'center', marginVertical: 40 }}>
            <Skeleton width={200} height={50} />
            <Skeleton width={100} height={20} style={{ marginTop: 10 }} />
          </View>
          <Skeleton width="100%" height={100} borderRadius={20} />
          <Skeleton width="100%" height={200} style={{ marginTop: 30 }} />
          <View style={{ marginTop: 30 }}>
            <Skeleton width={100} height={25} />
            <Skeleton width="100%" height={70} style={{ marginTop: 15 }} borderRadius={16} />
            <Skeleton width="100%" height={70} style={{ marginTop: 10 }} borderRadius={16} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Portfolio</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Subscription')} style={{ marginRight: 16 }}>
              <Text style={[styles.headerAction, { color: '#A855F7' }]}>Go Pro</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AIChat')} style={{ marginRight: 16 }}>
              <Text style={[styles.headerAction, { color: COLORS.primary }]}>AI Assistant</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
               <Text style={styles.headerAction}>Wallet</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.totalValue}>${parseFloat(portfolio?.totalValue || '0').toLocaleString()}</Text>
          <View style={styles.performanceRow}>
            <ProfitBadge percentage={portfolio?.change24h || 0} />
            <Text style={styles.performancePeriod}> (24h)</Text>
          </View>
        </View>

        <ChainSwitcher selectedChain={selectedChain} onSelect={setSelectedChain} />

        {aiInsight && (
          <InsightStrip 
            title={aiInsight.title}
            message={aiInsight.message}
            severity={aiInsight.severity}
            onPress={() => navigation.navigate('InsightsDetail')}
          />
        )}

        <View style={styles.insightStrip}>
          <Text style={styles.insightText}>📊 Portfolio Health: <Text style={{fontWeight: 'bold', color: COLORS.success}}>Strong</Text></Text>
        </View>

        <PortfolioChart data={history.length > 0 ? history : [0, 0, 0]} />

        <View style={styles.timeFilters}>
          {['24H', '7D', '30D', '1Y'].map(f => (
            <TouchableOpacity key={f} style={[styles.filterBtn, f === '7D' && styles.activeFilter]}>
              <Text style={[styles.filterText, f === '7D' && styles.activeFilterText]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Assets</Text>
        </View>

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

        {!portfolio?.tokens.length && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No assets yet</Text>
            <Text style={styles.emptySubtitle}>Your portfolio will appear here once you receive crypto.</Text>
            <TouchableOpacity 
              style={styles.receiveBtn}
              onPress={() => navigation.navigate('Receive')}
            >
              <Text style={styles.receiveBtnText}>Receive Crypto</Text>
            </TouchableOpacity>
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
  loaderContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: SPACING.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
  },
  headerAction: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  hero: {
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  totalValue: {
    ...TYPOGRAPHY.balance,
  },
  performanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  performancePeriod: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  insightStrip: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginVertical: SPACING.m,
  },
  insightText: {
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  timeFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  activeFilter: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterText: {
    color: 'white',
  },
  sectionHeader: {
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 20,
  },
  emptyState: {
    marginTop: 40,
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: 8,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  receiveBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  receiveBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
