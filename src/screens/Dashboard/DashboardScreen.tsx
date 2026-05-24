import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { apiClient } from '../../api/client';
import { fetchPortfolioHistory, fetchPortfolioSummary, fetchSupportedAssets, PortfolioSummary, SupportedAsset, TokenAsset } from '../../api/portfolio';
import PortfolioChart from '../../components/PortfolioChart';
import Skeleton from '../../components/Skeleton';
import { CryptofyIcon, CryptofyIconName } from '../../components/icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { useAccountStore } from '../../store/walletStore';

interface AiInsight {
  title?: string;
  text?: string;
  message?: string;
}

const timeFilters = ['24H', '7D', '1M', '1Y'];

const formatCurrency = (value: string | null) => {
  if (!value) return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numeric);
};

const formatPercent = (value: number | null) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}% today`;
};

function ActionButton({
  icon,
  label,
  onPress,
}: {
  icon: CryptofyIconName;
  label: string;
  onPress: () => void;
}) {
  const press = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: press.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        press.value = withSpring(0.95, { damping: 16, stiffness: 220 });
      }}
      onPressOut={() => {
        press.value = withSpring(1, { damping: 16, stiffness: 220 });
      }}
      style={styles.actionPressable}
    >
      <Animated.View style={[styles.action, animatedStyle]}>
        <View style={styles.actionIcon}>
          <CryptofyIcon name={icon} size={23} color={COLORS.primaryLight} />
        </View>
        <Text style={styles.actionText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { name, address, email } = useAccountStore();
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [supportedAssets, setSupportedAssets] = useState<SupportedAsset[]>([]);
  const [history, setHistory] = useState<number[]>([]);
  const [insight, setInsight] = useState<AiInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balancesVisible, setBalancesVisible] = useState(true);
  const [selectedRange, setSelectedRange] = useState('7D');
  const glow = useSharedValue(0);

  useEffect(() => {
    glow.value = withTiming(1, { duration: 1600 });
  }, [glow]);

  const cardGlowStyle = useAnimatedStyle(() => ({
    opacity: 0.18 + glow.value * 0.1,
    transform: [{ translateX: glow.value * 18 }],
  }));

  const loadDashboard = useCallback(async () => {
    if (!address) {
      setPortfolio(null);
      setHistory([]);
      setInsight(null);
      setError(null);
      fetchSupportedAssets().then(setSupportedAssets).catch(() => setSupportedAssets([]));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [summary, chart, aiResponse, assets] = await Promise.all([
        fetchPortfolioSummary(address),
        fetchPortfolioHistory(address).catch(() => []),
        apiClient.get(`/ai/portfolio/${address}`).then(response => response.data).catch(() => null),
        fetchSupportedAssets().catch(() => []),
      ]);

      setPortfolio(summary);
      setHistory(chart);
      setInsight(aiResponse?.insights?.[0] || aiResponse || null);
      setSupportedAssets(assets);
    } catch {
      setError('Portfolio data unavailable');
      setPortfolio(null);
      setHistory([]);
      setInsight(null);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const totalValue = formatCurrency(portfolio?.totalValue ?? null);
  const dailyChange = formatPercent(portfolio?.change24h ?? null);
  const tokens = portfolio?.tokens ?? [];
  const profileInitial = (name?.trim()?.[0] || email?.trim()?.[0] || 'U').toUpperCase();
  const hasAiNotice = Boolean(insight?.title || insight?.message);
  const isNegative = portfolio?.change24h !== null && portfolio?.change24h !== undefined && portfolio.change24h < 0;

  const renderToken = (item: TokenAsset) => {
    const tokenValue = formatCurrency(item.value);
    const change = formatPercent(item.change24h)?.replace(' today', '');
    const negativeToken = item.change24h !== null && item.change24h !== undefined && item.change24h < 0;

    return (
      <Pressable key={`${item.chain}-${item.symbol}`} style={({ pressed }) => [styles.assetRow, pressed && styles.assetRowPressed]}>
        <View style={styles.tokenIcon}>
          <Text style={styles.tokenIconText}>{item.symbol.slice(0, 1)}</Text>
        </View>
        <View style={styles.assetInfo}>
          <Text style={styles.assetName}>{item.name || item.symbol}</Text>
          <Text style={styles.assetMeta}>{item.amount} {item.symbol}</Text>
        </View>
        <View style={styles.assetValue}>
          <Text style={tokenValue ? styles.assetAmount : styles.assetMuted}>
            {balancesVisible ? tokenValue || 'Value unavailable' : 'Hidden'}
          </Text>
          {change && balancesVisible ? (
            <Text style={[styles.assetChange, negativeToken && styles.negativeChange]}>{change}</Text>
          ) : null}
        </View>
      </Pressable>
    );
  };

  const renderSupportedAsset = (item: SupportedAsset) => (
    <View key={`${item.rank}-${item.symbol}`} style={styles.supportedAssetPill}>
      <Text style={styles.supportedAssetSymbol}>{item.symbol}</Text>
      <Text style={styles.supportedAssetName} numberOfLines={1}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowMid} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.greeting}>Good evening, {name}</Text>
            <Text style={styles.headerSubtext}>Welcome back</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.headerIcon, hasAiNotice && styles.headerIconActive]} onPress={() => navigation.navigate('InsightsDetail')}>
              <CryptofyIcon name="bell" size={19} color={hasAiNotice ? COLORS.primaryLight : COLORS.textSecondary} />
              {hasAiNotice ? <View style={styles.unreadDot} /> : null}
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Settings')}>
              <Text style={styles.profileInitial}>{profileInitial}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <LinearGradient colors={['rgba(10,132,255,0.24)', 'rgba(16,24,42,0.94)', 'rgba(8,13,26,0.98)']} style={styles.balanceCard}>
          <Animated.View style={[styles.cardLighting, cardGlowStyle]} />
          <View style={styles.balanceTopRow}>
            <Text style={styles.balanceLabel}>Total Portfolio</Text>
            <TouchableOpacity style={styles.eyeButton} onPress={() => setBalancesVisible(prev => !prev)}>
              <CryptofyIcon name={balancesVisible ? 'eye' : 'eyeOff'} size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          {loading ? (
            <Skeleton width="82%" height={56} borderRadius={16} style={styles.balanceSkeleton} />
          ) : totalValue ? (
            <Text style={styles.balance}>{balancesVisible ? totalValue : 'Hidden'}</Text>
          ) : (
            <Text style={styles.emptyHeroText}>{address ? 'Portfolio value unavailable' : 'Portfolio will appear after account setup'}</Text>
          )}
          {dailyChange && balancesVisible ? (
            <View style={styles.gainRow}>
              <View style={[styles.trendPill, isNegative && styles.trendPillNegative]}>
                <CryptofyIcon name={isNegative ? 'arrowDown' : 'arrowUp'} size={15} color={isNegative ? COLORS.error : COLORS.success} />
                <Text style={[styles.gainText, isNegative && styles.negativeChange]}>{dailyChange}</Text>
              </View>
            </View>
          ) : null}
        </LinearGradient>

        {error ? (
          <TouchableOpacity style={styles.errorCard} onPress={loadDashboard}>
            <Text style={styles.errorTitle}>{error}</Text>
            <Text style={styles.errorText}>Tap to retry.</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.actionRow}>
          <ActionButton icon="send" label="Send" onPress={() => navigation.navigate('Send')} />
          <ActionButton icon="arrowDown" label="Receive" onPress={() => navigation.navigate('Receive')} />
          <ActionButton icon="buy" label="Buy" onPress={() => Alert.alert('Buy unavailable', 'Buy will appear when live payment rails are enabled.')} />
          <ActionButton icon="swap" label="Swap" onPress={() => Alert.alert('Swap unavailable', 'Swap will appear when live routing is enabled.')} />
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Portfolio Performance</Text>
            <View style={styles.timeFilters}>
              {timeFilters.map(filter => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.timeFilter, selectedRange === filter && styles.timeFilterActive]}
                  onPress={() => setSelectedRange(filter)}
                >
                  <Text style={[styles.timeFilterText, selectedRange === filter && styles.timeFilterTextActive]}>{filter}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {loading ? <Skeleton width="100%" height={200} borderRadius={18} /> : <PortfolioChart data={history} />}
        </View>

        <TouchableOpacity style={styles.insightCard} activeOpacity={0.86} onPress={() => navigation.navigate('InsightsDetail')}>
          <View style={styles.insightGlow} />
          <View style={styles.insightIcon}>
            <CryptofyIcon name="ai" size={19} color={COLORS.primaryLight} />
          </View>
          <View style={styles.insightCopy}>
            <Text style={styles.insightLabel}>AI Insight</Text>
            <Text style={styles.insightTitle}>{insight?.title || insight?.message || 'AI service unavailable'}</Text>
            {insight?.text ? <Text style={styles.insightText}>{insight.text}</Text> : null}
            <View style={styles.analysisLink}>
              <Text style={styles.analysisLinkText}>View Full Analysis</Text>
              <CryptofyIcon name="chevronRight" size={15} color={COLORS.primaryLight} />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Assets</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Portfolio')}>
            <Text style={styles.linkText}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.assetList}>
          {loading ? (
            <>
              <Skeleton width="100%" height={78} borderRadius={20} />
              <Skeleton width="100%" height={78} borderRadius={20} />
            </>
          ) : tokens.length > 0 ? (
            tokens.map(renderToken)
          ) : (
            <View style={styles.emptyCard}>
              <CryptofyIcon name="wallet" size={26} color={COLORS.primaryLight} />
              <Text style={styles.emptyTitle}>No assets yet</Text>
              <Text style={styles.emptyText}>Your live balances will appear here once assets are available.</Text>
            </View>
          )}
        </View>

        {supportedAssets.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Supported Markets</Text>
            </View>
            <View style={styles.supportedGrid}>
              {supportedAssets.map(renderSupportedAsset)}
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundGlowTop: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(10,132,255,0.16)',
  },
  backgroundGlowMid: {
    position: 'absolute',
    top: 260,
    right: -110,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(165,216,255,0.07)',
  },
  content: {
    padding: SPACING.l,
    paddingBottom: 130,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  headerCopy: {
    flex: 1,
  },
  greeting: {
    ...TYPOGRAPHY.h2,
    fontSize: 23,
  },
  headerSubtext: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 17,
    backgroundColor: 'rgba(16,24,42,0.82)',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconActive: {
    borderColor: 'rgba(165,216,255,0.22)',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 14,
  },
  unreadDot: {
    position: 'absolute',
    top: 11,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 17,
    backgroundColor: 'rgba(10,132,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: COLORS.primaryLight,
    fontWeight: '900',
    fontSize: 16,
  },
  balanceCard: {
    minHeight: 168,
    borderRadius: 24,
    padding: SPACING.l,
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.18)',
    overflow: 'hidden',
    marginBottom: SPACING.l,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 18 },
    elevation: 12,
  },
  cardLighting: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(165,216,255,0.55)',
    top: -72,
    right: -68,
  },
  balanceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.l,
  },
  balanceLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
  },
  eyeButton: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balance: {
    ...TYPOGRAPHY.balance,
    fontSize: 34,
    letterSpacing: 0,
  },
  balanceSkeleton: {
    marginTop: 2,
  },
  emptyHeroText: {
    color: COLORS.textPrimary,
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 29,
  },
  gainRow: {
    flexDirection: 'row',
    marginTop: SPACING.m,
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.18)',
  },
  trendPillNegative: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderColor: 'rgba(239,68,68,0.18)',
  },
  gainText: {
    color: COLORS.success,
    fontWeight: '800',
    fontSize: 13,
  },
  negativeChange: {
    color: COLORS.error,
  },
  errorCard: {
    padding: SPACING.m,
    borderRadius: 18,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    marginBottom: SPACING.m,
  },
  errorTitle: {
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  errorText: {
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.l,
  },
  actionPressable: {
    width: '23%',
  },
  action: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 58,
    height: 58,
    borderRadius: 22,
    backgroundColor: 'rgba(16,24,42,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: COLORS.textSecondary,
    fontWeight: '800',
    fontSize: 12,
  },
  chartCard: {
    backgroundColor: 'rgba(16,24,42,0.84)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  chartHeader: {
    gap: SPACING.m,
    marginBottom: SPACING.s,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
  },
  timeFilters: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    padding: 4,
  },
  timeFilter: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 11,
  },
  timeFilterActive: {
    backgroundColor: 'rgba(10,132,255,0.16)',
  },
  timeFilterText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '800',
  },
  timeFilterTextActive: {
    color: COLORS.primaryLight,
  },
  insightCard: {
    flexDirection: 'row',
    gap: SPACING.m,
    padding: SPACING.m,
    borderRadius: 22,
    backgroundColor: 'rgba(10,132,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.18)',
    marginBottom: SPACING.l,
    overflow: 'hidden',
  },
  insightGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    right: -50,
    top: -60,
    backgroundColor: 'rgba(10,132,255,0.18)',
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: 17,
    backgroundColor: 'rgba(10,132,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.15)',
  },
  insightCopy: {
    flex: 1,
  },
  insightLabel: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 5,
  },
  insightTitle: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: 15,
    lineHeight: 21,
  },
  insightText: {
    color: COLORS.textSecondary,
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
  },
  analysisLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  analysisLinkText: {
    color: COLORS.primaryLight,
    fontWeight: '800',
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  linkText: {
    color: COLORS.primaryLight,
    fontWeight: '800',
    fontSize: 13,
  },
  assetList: {
    gap: SPACING.s,
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    borderRadius: 20,
    backgroundColor: 'rgba(16,24,42,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  assetRowPressed: {
    transform: [{ scale: 0.99 }],
    borderColor: 'rgba(165,216,255,0.18)',
  },
  tokenIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(10,132,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  tokenIconText: {
    color: COLORS.primaryLight,
    fontWeight: '900',
    fontSize: 16,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: 15,
  },
  assetMeta: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 3,
  },
  assetValue: {
    alignItems: 'flex-end',
  },
  assetAmount: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: 14,
  },
  assetMuted: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  assetChange: {
    color: COLORS.success,
    fontSize: 12,
    marginTop: 3,
    fontWeight: '800',
  },
  emptyCard: {
    padding: SPACING.l,
    borderRadius: 22,
    backgroundColor: 'rgba(16,24,42,0.86)',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontWeight: '900',
    fontSize: 16,
    marginTop: 10,
  },
  emptyText: {
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 19,
  },
  supportedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: SPACING.xxl,
  },
  supportedAssetPill: {
    width: '30.5%',
    minHeight: 68,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: 'rgba(16,24,42,0.76)',
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.1)',
    justifyContent: 'center',
  },
  supportedAssetSymbol: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 4,
  },
  supportedAssetName: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
});
