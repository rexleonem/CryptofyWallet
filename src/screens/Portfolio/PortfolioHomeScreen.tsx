import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWalletStore } from '../../store/walletStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { fetchPortfolioSummary, fetchPortfolioHistory, fetchSupportedAssets, PortfolioSummary, SupportedAsset } from '../../api/portfolio';
import { addAssetToPortfolio } from '../../api/portfolio';
import PortfolioChart from '../../components/PortfolioChart';
import TokenRow from '../../components/TokenRow';
import TextIcon from '../../components/TextIcon';

const formatCurrency = (value: string | null) => {
  if (!value) {
    return null;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric)
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numeric)
    : null;
};

export default function PortfolioHomeScreen() {
  const navigation = useNavigation<any>();
  const { address } = useWalletStore();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const [addVisible, setAddVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<SupportedAsset | null>(null);
  const [assetAmount, setAssetAmount] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [supportedAssets, setSupportedAssets] = useState<SupportedAsset[]>([]);
  const [timeFilter, setTimeFilter] = useState('7D');
  const [walletSection, setWalletSection] = useState<'crypto' | 'fiat'>('crypto');

  const fetchData = async () => {
    if (!address) {
      setPortfolio(null);
      setHistory([]);
      fetchSupportedAssets().then(setSupportedAssets).catch(() => setSupportedAssets([]));
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const [summary, historyData, assets] = await Promise.all([
        fetchPortfolioSummary(address),
        fetchPortfolioHistory(address),
        fetchSupportedAssets().catch(() => [])
      ]);
      
      setPortfolio(summary);
      setHistory(historyData);
      setSupportedAssets(assets);
    } catch (error) {
      console.error('Portfolio Fetch Error:', error);
      Alert.alert('Sync Error', 'Unable to fetch latest portfolio data.');
      setPortfolio(null);
      setHistory([]);
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

  const addAsset = async () => {
    if (!address) {
      Alert.alert('Unavailable', 'Your portfolio will appear after account setup.');
      return;
    }
    const amount = assetAmount.trim();
    if (!selectedAsset) {
      Alert.alert('Select an asset', 'Choose an asset to add.');
      return;
    }
    if (!/^\d+(\.\d+)?$/.test(amount)) {
      Alert.alert('Enter an amount', 'Amount must be a numeric value.');
      return;
    }

    try {
      await addAssetToPortfolio(address, {
        symbol: selectedAsset.symbol,
        name: selectedAsset.name,
        coingeckoId: selectedAsset.coingeckoId,
        chain: selectedAsset.category === 'fiat' ? 'FIAT' : 'CUSTODY',
        amount,
      });
      setAddVisible(false);
      setSelectedAsset(null);
      setAssetAmount('');
      onRefresh();
    } catch (e: any) {
      Alert.alert('Unable to add asset', e?.response?.data?.message || 'Please try again.');
    }
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

  const change = portfolio?.change24h ?? null;
  const isPositive = typeof change === 'number' && change >= 0;
  const tokens = portfolio?.tokens || [];
  const cryptoTokens = tokens.filter((t: any) => String(t?.chain || '').toUpperCase() !== 'FIAT' && !['USD', 'EUR', 'GBP', 'NGN'].includes(String(t?.symbol || '').toUpperCase()));
  const fiatTokens = tokens.filter((t: any) => String(t?.chain || '').toUpperCase() === 'FIAT' || ['USD', 'EUR', 'GBP', 'NGN'].includes(String(t?.symbol || '').toUpperCase()));
  const netWorth = formatCurrency(portfolio?.totalValue ?? null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={TYPOGRAPHY.h2}>Wallets</Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => setAddVisible(true)}>
          <TextIcon label="+" size={18} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(tabBarHeight, insets.bottom) + SPACING.xl },
        ]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Net Worth</Text>
          {netWorth ? (
            <Text style={styles.summaryValue}>{netWorth}</Text>
          ) : (
            <Text style={styles.summaryEmpty}>{address ? 'Value unavailable' : 'Portfolio will appear after account setup'}</Text>
          )}
          {typeof change === 'number' ? (
            <View style={styles.performanceRow}>
              <View style={[styles.badge, { backgroundColor: isPositive ? `${COLORS.success}15` : `${COLORS.error}15` }]}>
                <TextIcon label={isPositive ? '+' : '-'} size={14} color={isPositive ? COLORS.success : COLORS.error} />
                <Text style={[styles.badgeText, { color: isPositive ? COLORS.success : COLORS.error }]}>
                  {isPositive ? '+' : ''}{change.toFixed(2)}%
                </Text>
              </View>
              <Text style={styles.performancePeriod}>last 24 hours</Text>
            </View>
          ) : null}
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
          <PortfolioChart data={history} />
        </View>

        <View style={styles.aiSection}>
          <View style={styles.sectionHeaderRow}>
            <TextIcon label="AI" size={16} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>AI Insights</Text>
          </View>
          <TouchableOpacity style={styles.insightCard} onPress={() => navigation.navigate('InsightsDetail')}>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>AI service unavailable</Text>
              <Text style={styles.insightMessage}>Live insights will appear here when the intelligence service returns portfolio analysis.</Text>
            </View>
            <TextIcon label=">" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeaderRow}>
          <TextIcon label="%" size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Holdings</Text>
        </View>

        <View style={styles.assetsList}>
          <View style={styles.segmentWrap}>
            <TouchableOpacity
              style={[styles.segment, walletSection === 'crypto' && styles.segmentActive]}
              onPress={() => setWalletSection('crypto')}
              activeOpacity={0.9}
            >
              <Text style={[styles.segmentText, walletSection === 'crypto' && styles.segmentTextActive]}>Crypto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segment, walletSection === 'fiat' && styles.segmentActive]}
              onPress={() => setWalletSection('fiat')}
              activeOpacity={0.9}
            >
              <Text style={[styles.segmentText, walletSection === 'fiat' && styles.segmentTextActive]}>Fiat</Text>
            </TouchableOpacity>
          </View>

          {(walletSection === 'crypto' ? cryptoTokens : fiatTokens).map((token: any, i: number) => (
            <TokenRow 
              key={`${token.symbol}-${i}`}
              symbol={token.symbol}
              name={token.name || token.symbol}
              amount={token.amount}
              value={token.value}
              change24h={token.change24h}
              onPress={() => navigation.navigate('TokenDetail', { token })}
            />
          ))}
        </View>

        {(walletSection === 'crypto' ? cryptoTokens : fiatTokens).length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{walletSection === 'crypto' ? 'No crypto yet' : 'No fiat balances yet'}</Text>
            <Text style={styles.emptySubtitle}>
              {walletSection === 'crypto'
                ? 'Your crypto balances will appear here once you add an asset or receive funds.'
                : 'Your fiat balances will appear here once you add a currency.'}
            </Text>
          </View>
        )}

        {supportedAssets.length > 0 && (
          <View style={styles.supportedSection}>
            <View style={styles.sectionHeaderRow}>
              <TextIcon label="+" size={18} color={COLORS.primaryLight} />
              <Text style={styles.sectionTitle}>Supported Markets</Text>
            </View>
            <View style={styles.supportedGrid}>
              {supportedAssets.map(asset => (
                <View key={`${asset.rank}-${asset.symbol}`} style={styles.supportedPill}>
                  <Text style={styles.supportedSymbol}>{asset.symbol}</Text>
                  <Text style={styles.supportedName} numberOfLines={1}>{asset.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <Modal visible={addVisible} transparent animationType="fade" onRequestClose={() => setAddVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Asset</Text>
            <Text style={styles.modalSubtitle}>Choose an asset and enter the amount you own.</Text>

            <ScrollView style={styles.assetPicker} contentContainerStyle={styles.assetPickerContent} showsVerticalScrollIndicator={false}>
              {supportedAssets.map((asset) => {
                const active = selectedAsset?.symbol === asset.symbol;
                return (
                  <TouchableOpacity
                    key={`${asset.rank}-${asset.symbol}`}
                    style={[styles.assetOption, active && styles.assetOptionActive]}
                    onPress={() => setSelectedAsset(asset)}
                    activeOpacity={0.86}
                  >
                    <View style={styles.assetOptionLeft}>
                      <View style={[styles.assetDot, active && styles.assetDotActive]} />
                      <View>
                        <Text style={styles.assetOptionSymbol}>{asset.symbol}</Text>
                        <Text style={styles.assetOptionName} numberOfLines={1}>{asset.name}</Text>
                      </View>
                    </View>
                    <Text style={styles.assetOptionCategory}>
                      {asset.category === 'fiat' ? 'Fiat' : asset.category === 'cryptofy' ? 'Cryptofy' : 'Market'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TextInput
              value={assetAmount}
              onChangeText={setAssetAmount}
              placeholder="Amount (e.g. 0.5)"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="decimal-pad"
              style={styles.modalInput}
            />

            <TouchableOpacity
              style={[styles.modalButton, (!selectedAsset || assetAmount.trim().length === 0) && styles.modalButtonDisabled]}
              onPress={addAsset}
              disabled={!selectedAsset || assetAmount.trim().length === 0}
            >
              <Text style={styles.modalButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setAddVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 32,
  },
  summaryEmpty: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginTop: 6,
    lineHeight: 28,
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
  supportedSection: {
    marginTop: SPACING.m,
    marginBottom: SPACING.xxl,
  },
  supportedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  supportedPill: {
    width: '30.5%',
    minHeight: 66,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(16,24,42,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.11)',
    justifyContent: 'center',
  },
  supportedSymbol: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 4,
  },
  supportedName: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: SPACING.l,
  },
  modalCard: {
    backgroundColor: 'rgba(16,24,42,0.96)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.18)',
    padding: SPACING.l,
    maxHeight: '82%',
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  modalSubtitle: {
    color: COLORS.textSecondary,
    marginTop: 6,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  assetPicker: {
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(5,8,22,0.38)',
  },
  assetPickerContent: {
    padding: 10,
    gap: 8,
  },
  assetOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  assetOptionActive: {
    borderColor: 'rgba(165,216,255,0.22)',
    backgroundColor: 'rgba(10,132,255,0.12)',
  },
  assetOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  assetDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(182,194,217,0.5)',
  },
  assetDotActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  assetOptionSymbol: {
    color: COLORS.textPrimary,
    fontWeight: '900',
    fontSize: 13,
  },
  assetOptionName: {
    color: COLORS.textMuted,
    fontWeight: '700',
    fontSize: 11,
    marginTop: 2,
    maxWidth: 180,
  },
  assetOptionCategory: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 10,
  },
  modalInput: {
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(5,8,22,0.46)',
    borderWidth: 1,
    borderColor: 'rgba(182,194,217,0.16)',
    paddingHorizontal: 12,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  modalButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
  },
  modalCancel: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 6,
  },
  modalCancelText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '800',
  },
  segmentWrap: {
    flexDirection: 'row',
    gap: 10,
    padding: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: SPACING.m,
  },
  segment: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: 'rgba(10,132,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.22)',
  },
  segmentText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '900',
  },
  segmentTextActive: {
    color: COLORS.primaryLight,
  },
});
