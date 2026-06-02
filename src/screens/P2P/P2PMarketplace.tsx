import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  StatusBar,
  TextInput,
  RefreshControl,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { fetchP2POffers, P2POffer } from '../../api/p2p';
import TextIcon from '../../components/TextIcon';

const P2PMarketplace = () => {
  const [offers, setOffers] = useState<P2POffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'BUY' | 'SELL'>('BUY');
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  // This screen can be opened from the stack (not always inside a tab navigator),
  // so we must NOT use `useBottomTabBarHeight()` here (it can crash).
  const floatingTabBarSpace = 64 + Math.max(insets.bottom, 12) + 18;

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const data = await fetchP2POffers();
      setOffers(data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOffers();
  };

  const renderOffer = ({ item }: { item: P2POffer }) => {
    const userName = item?.user?.name || 'Verified trader';
    const rating = item?.user?.rating;
    const trades = item?.user?.trades;
    const type = item?.type;
    const asset = item?.asset;
    const price = item?.price;
    const paymentMethods = Array.isArray(item?.paymentMethods) ? item.paymentMethods : [];

    return (
      <TouchableOpacity 
        style={styles.offerCard}
        onPress={() => Alert.alert('Trade details', 'Trade details will appear here once the flow is connected.')}
      >
        <View style={styles.offerHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
            </View>
            <View>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{userName}</Text>
                {typeof rating === 'number' && rating >= 4.8 && <TextIcon label="OK" size={11} color={COLORS.secondary} />}
              </View>
              {typeof trades === 'number' && typeof rating === 'number' ? (
                <Text style={styles.userStats}>{trades} trades - {Math.round(rating * 20)}% completion</Text>
              ) : null}
            </View>
          </View>
          <View style={[styles.typeBadge, type === 'SELL' ? styles.sellBadge : styles.buyBadge]}>
            <Text style={[styles.typeText, type === 'SELL' ? styles.sellText : styles.buyText]}>
              {type}
            </Text>
          </View>
        </View>
        
        <View style={styles.priceSection}>
          <View>
            <Text style={styles.assetLabel}>{asset ? `${asset} Price` : 'Asset price'}</Text>
            <Text style={styles.priceValue}>{typeof price === 'number' ? `$${price.toLocaleString()}` : 'Unavailable'}</Text>
          </View>
          <View style={styles.limitInfo}>
            <Text style={styles.limitLabel}>Available Limits</Text>
            <Text style={styles.limitValue}>
              {item?.minAmount && item?.maxAmount ? `$${item.minAmount} - $${item.maxAmount}` : 'Unavailable'}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.paymentMethods}>
            {paymentMethods.slice(0, 2).map((m, i) => (
              <View key={i} style={styles.methodBadge}>
                <TextIcon label="#" size={12} color={COLORS.textMuted} />
                <Text style={styles.methodText}>{m}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={[styles.tradeButton, { backgroundColor: type === 'SELL' ? COLORS.primary : COLORS.secondary }]}>
            <Text style={styles.tradeButtonText}>{type === 'SELL' ? 'Buy' : 'Sell'}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={TYPOGRAPHY.h2}>P2P Market</Text>
        <TouchableOpacity style={styles.historyBtn}>
          <Text style={styles.historyBtnText}>My Trades</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextIcon label="?" size={18} color={COLORS.textMuted} />
          <TextInput 
            placeholder="Search assets or users..." 
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterIconButton}>
          <TextIcon label="F" size={18} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, filter === 'BUY' && styles.activeTab]}
          onPress={() => setFilter('BUY')}
        >
          <Text style={[styles.tabText, filter === 'BUY' && styles.activeTabText]}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, filter === 'SELL' && styles.activeTab]}
          onPress={() => setFilter('SELL')}
        >
          <Text style={[styles.tabText, filter === 'SELL' && styles.activeTabText]}>Sell</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={Array.isArray(offers) ? offers.filter(o => o?.type === filter) : []}
          renderItem={renderOffer}
          keyExtractor={(item, index) => String((item as any)?.id ?? index)}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: floatingTabBarSpace + SPACING.xl },
          ]}
          showsVerticalScrollIndicator={false}
          onRefresh={loadOffers}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No offers found for this asset.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

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
  historyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  historyBtnText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.l,
    gap: SPACING.m,
    marginBottom: SPACING.m,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: SPACING.m,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.s,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  filterIconButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.m,
    gap: SPACING.s,
  },
  tab: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.card,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  activeTabText: {
    color: COLORS.white,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: SPACING.l,
    paddingTop: 0,
    gap: SPACING.m,
  },
  offerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.m,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 15,
  },
  userStats: {
    ...TYPOGRAPHY.small,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  buyBadge: {
    backgroundColor: `${COLORS.secondary}15`,
  },
  sellBadge: {
    backgroundColor: `${COLORS.error}15`,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  buyText: {
    color: COLORS.secondary,
  },
  sellText: {
    color: COLORS.error,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.m,
    flexWrap: 'wrap',
    marginBottom: SPACING.m,
    paddingVertical: SPACING.m,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  assetLabel: {
    ...TYPOGRAPHY.label,
    fontSize: 9,
  },
  priceValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  limitInfo: {
    alignItems: 'flex-end',
    minWidth: 120,
  },
  limitLabel: {
    ...TYPOGRAPHY.label,
    fontSize: 9,
  },
  limitValue: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.m,
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
    flexWrap: 'wrap',
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.cardSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  methodText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  tradeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  tradeButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
});

export default P2PMarketplace;
