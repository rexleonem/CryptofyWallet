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
  Image,
  Dimensions,
  StatusBar
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../../store/walletStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { CURRENCIES } from '../../constants/Currencies';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  RefreshCw, 
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
  const [balance, setBalance] = useState({ eth: '0.00', usd: '0.00', cfyc: '1250.00', chusd: '100.00' });
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const fetchBalance = async () => {
    if (!address) return;
    try {
      // Mocking balance fetch
      // In a real app, you'd fetch from an API or blockchain
      setBalance(prev => ({
        ...prev,
        eth: '1.24',
        usd: '3,450.00'
      }));
    } catch (error) {
      console.error('Balance Fetch Error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [address]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBalance();
  };

  const copyAddress = () => {
    Clipboard.setString(address || '');
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

  const AssetCard = ({ currency, balance, usdValue }: any) => (
    <TouchableOpacity 
      style={styles.assetCard} 
      onPress={() => navigation.navigate('TokenDetail', { currency })}
    >
      <View style={[styles.assetIconContainer, { backgroundColor: `${currency.color}15` }]}>
        <Text style={[styles.assetIconText, { color: currency.color }]}>
          {currency.symbol.substring(0, 1)}
        </Text>
      </View>
      <View style={styles.assetInfo}>
        <Text style={styles.assetName}>{currency.name}</Text>
        <Text style={styles.assetSymbol}>{currency.symbol}</Text>
      </View>
      <View style={styles.assetValue}>
        <Text style={styles.assetBalanceText}>
          {showBalance ? balance : '••••'} {currency.symbol}
        </Text>
        <Text style={styles.assetUsdText}>
          {showBalance ? `$${usdValue}` : '••••'}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
            {showBalance ? `$${balance.usd}` : '$••••••'}
          </Text>
          
          <View style={styles.balanceFooter}>
            <View style={styles.changeBadge}>
              <ArrowUpRight size={14} color={COLORS.success} />
              <Text style={styles.changeText}>+5.24%</Text>
            </View>
            <Text style={styles.secondaryBalance}>
              ≈ {showBalance ? balance.eth : '•••'} ETH
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
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.assetsList}>
          <AssetCard 
            currency={CURRENCIES[0]} 
            balance={balance.eth} 
            usdValue="3,240.00" 
          />
          <AssetCard 
            currency={CURRENCIES[1]} 
            balance={balance.cfyc} 
            usdValue="125.00" 
          />
          <AssetCard 
            currency={CURRENCIES[2]} 
            balance={balance.chusd} 
            usdValue="100.00" 
          />
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
    backgroundColor: `${COLORS.success}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  changeText: {
    color: COLORS.success,
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
