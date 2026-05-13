import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  RefreshControl, 
  Alert, 
  Dimensions,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../../store/walletStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { fetchPortfolioSummary, PortfolioSummary, TokenAsset } from '../../api/portfolio';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Copy, 
  Wallet,
  Eye,
  EyeOff,
  Bell,
  ArrowRightLeft
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { address } = useWalletStore();
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const loadData = async () => {
    if (!address) return;
    try {
      const data = await fetchPortfolioSummary(address);
      setPortfolio(data);
    } catch (error) {
      console.error('Balance Fetch Error:', error);
      Alert.alert('Network Error', 'Could not sync wallet data. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [address]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const copyAddress = () => {
    if (!address) return;
    Clipboard.setString(address);
    Alert.alert('Copied', 'Address copied to clipboard');
  };

  const QuickAction = ({ icon: Icon, label, onPress, color = COLORS.primary }: any) => (
    <View style={styles.actionItem}>
      <TouchableOpacity 
        style={[styles.actionIconButton, { backgroundColor: `${color}15` }]} 
        onPress={onPress}
      >
        <Icon size={24} color={color} />
      </TouchableOpacity>
      <Text style={styles.actionLabel}>{label}</Text>
    </View>
  );

  const AssetCard = ({ token }: { token: TokenAsset }) => (
    <TouchableOpacity 
      style={styles.assetCard} 
      onPress={() => navigation.navigate('TokenDetail', { token })}
    >
      <View style={[styles.assetIconContainer, { backgroundColor: `${COLORS.primary}15` }]}>
        <Text style={[styles.assetIconText, { color: COLORS.primary }]}>
          {token.symbol.substring(0, 1)}
        </Text>
      </View>
      <View style={styles.assetInfo}>
        <Text style={styles.assetName}>{token.name}</Text>
        <Text style={styles.assetSymbol}>{token.symbol}</Text>
      </View>
      <View style={styles.assetValue}>
        <Text style={styles.assetBalanceText}>
          {showBalance ? parseFloat(token.amount).toFixed(4) : '••••'} {token.symbol}
        </Text>
        <Text style={styles.assetUsdText}>
          {showBalance ? `$${token.value}` : '••••'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const ethToken = Array.isArray(portfolio?.tokens) ? portfolio?.tokens.find(t => t?.symbol === 'ETH') : null;
  const mainBalance = portfolio?.totalValue || '0.00';
  const change = portfolio?.change24h || 0;


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.username}>Wallet Holder</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconButton}>
            <Bell size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconButton} onPress={() => navigation.navigate('Settings')}>
            <View style={styles.profileIndicator} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceTitleRow}>
              <Wallet size={16} color={COLORS.textMuted} />
              <Text style={styles.balanceTitle}>Total Balance</Text>
              <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                {showBalance ? <Eye size={16} color={COLORS.textMuted} /> : <EyeOff size={16} color={COLORS.textMuted} />}
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.copyAddressButton} onPress={copyAddress}>
              <Text style={styles.addressShort} numberOfLines={1} ellipsizeMode="middle">{address}</Text>
              <Copy size={12} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.mainBalance}>
            {showBalance ? `$${parseFloat(mainBalance).toLocaleString()}` : '$••••••'}
          </Text>
          
          <View style={styles.balanceFooter}>
            <View style={[styles.changeBadge, { backgroundColor: change >= 0 ? `${COLORS.success}15` : `${COLORS.error}15` }]}>
              {change >= 0 ? <ArrowUpRight size={14} color={COLORS.success} /> : <ArrowDownLeft size={14} color={COLORS.error} />}
              <Text style={[styles.changeText, { color: change >= 0 ? COLORS.success : COLORS.error }]}>
                {change >= 0 ? '+' : ''}{change}%
              </Text>
            </View>
            <Text style={styles.secondaryBalance}>
              ≈ {showBalance ? (ethToken ? ethToken.amount : '0.00') : '•••'} ETH
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <QuickAction 
            icon={ArrowUpRight} 
            label="Send" 
            onPress={() => navigation.navigate('Send')} 
          />
          <QuickAction 
            icon={ArrowDownLeft} 
            label="Receive" 
            onPress={() => navigation.navigate('Receive')} 
            color={COLORS.secondary}
          />
          <QuickAction 
            icon={Plus} 
            label="Buy" 
            onPress={() => {}} 
            color={COLORS.accent}
          />
          <QuickAction 
            icon={ArrowRightLeft} 
            label="Swap" 
            onPress={() => {}} 
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Assets</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Portfolio')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.assetsList}>
          {Array.isArray(portfolio?.tokens) && portfolio.tokens.length > 0 ? (
            portfolio.tokens.map((token, i) => (
              <AssetCard key={`${token?.symbol}-${i}`} token={token} />
            ))
          ) : (
            <View style={styles.emptyAssets}>
              <Text style={styles.emptyText}>No assets found in this wallet</Text>
            </View>
          )}
        </View>

        <View style={styles.promoCard}>
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>Earn CFYC</Text>
            <Text style={styles.promoSubtitle}>Stake your assets and earn up to 12% APY</Text>
          </View>
          <TouchableOpacity style={styles.promoButton}>
            <Text style={styles.promoButtonText}>Stake Now</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
  },
  greeting: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
  },
  username: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 18,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    padding: SPACING.l,
  },
  balanceCard: {
    backgroundColor: COLORS.card,
    borderRadius: 28,
    padding: SPACING.l,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  balanceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 10,
  },
  copyAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}10`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 6,
  },
  addressShort: {
    fontSize: 10,
    color: COLORS.primary,
    maxWidth: 80,
  },
  mainBalance: {
    ...TYPOGRAPHY.balance,
    marginBottom: SPACING.s,
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  secondaryBalance: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  actionIconButton: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    ...TYPOGRAPHY.small,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  assetsList: {
    gap: SPACING.m,
    marginBottom: SPACING.xl,
  },
  assetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.m,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  assetIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  assetIconText: {
    fontSize: 18,
    fontWeight: '700',
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 15,
  },
  assetSymbol: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
  },
  assetValue: {
    alignItems: 'flex-end',
  },
  assetBalanceText: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 15,
  },
  assetUsdText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
  },
  emptyAssets: {
    padding: SPACING.xl,
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
  promoCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: SPACING.l,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },
  promoTextContainer: {
    flex: 1,
    marginRight: SPACING.m,
  },
  promoTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.white,
    fontSize: 18,
  },
  promoSubtitle: {
    ...TYPOGRAPHY.small,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  promoButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  promoButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});
