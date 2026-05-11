import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { 
  Search, 
  Filter, 
  User, 
  ShieldCheck,
  CreditCard
} from 'lucide-react-native';

interface Offer {
  id: string;
  type: 'BUY' | 'SELL';
  asset: string;
  price: number;
  minAmount: number;
  maxAmount: number;
  paymentMethods: string[];
  user: {
    name: string;
    rating: number;
    trades: number;
  };
}

const P2PMarketplace = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'BUY' | 'SELL'>('BUY');
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      // Mocking P2P offers
      const mockOffers: Offer[] = [
        {
          id: '1',
          type: 'SELL',
          asset: 'ETH',
          price: 2650.40,
          minAmount: 100,
          maxAmount: 5000,
          paymentMethods: ['Bank Transfer', 'PayPal'],
          user: { name: 'CryptoWhale', rating: 4.9, trades: 1250 }
        },
        {
          id: '2',
          type: 'BUY',
          asset: 'CFYC',
          price: 0.12,
          minAmount: 50,
          maxAmount: 1000,
          paymentMethods: ['Revolut', 'Wise'],
          user: { name: 'EarlyAdopter', rating: 4.7, trades: 450 }
        },
        {
          id: '3',
          type: 'SELL',
          asset: 'CHUSD',
          price: 1.00,
          minAmount: 10,
          maxAmount: 10000,
          paymentMethods: ['Bank Transfer', 'Zelle'],
          user: { name: 'SecureTrade', rating: 5.0, trades: 890 }
        },
        {
          id: '4',
          type: 'SELL',
          asset: 'CFYC',
          price: 0.11,
          minAmount: 100,
          maxAmount: 2000,
          paymentMethods: ['Crypto Wallet'],
          user: { name: 'CFYFan', rating: 4.8, trades: 120 }
        }
      ];
      setOffers(mockOffers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOffer = ({ item }: { item: Offer }) => (
    <TouchableOpacity 
      style={styles.offerCard}
      onPress={() => navigation.navigate('TradeDetails', { offer: item })}
    >
      <View style={styles.offerHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.user.name.charAt(0)}</Text>
          </View>
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{item.user.name}</Text>
              {item.user.rating >= 4.8 && <ShieldCheck size={14} color={COLORS.secondary} />}
            </View>
            <Text style={styles.userStats}>{item.user.trades} trades • {item.user.rating * 20}% completion</Text>
          </View>
        </View>
        <View style={[styles.typeBadge, item.type === 'SELL' ? styles.sellBadge : styles.buyBadge]}>
          <Text style={[styles.typeText, item.type === 'SELL' ? styles.sellText : styles.buyText]}>
            {item.type}
          </Text>
        </View>
      </View>
      
      <View style={styles.priceSection}>
        <View>
          <Text style={styles.assetLabel}>{item.asset} Price</Text>
          <Text style={styles.priceValue}>${item.price.toLocaleString()}</Text>
        </View>
        <View style={styles.limitInfo}>
          <Text style={styles.limitLabel}>Available Limits</Text>
          <Text style={styles.limitValue}>${item.minAmount} - ${item.maxAmount}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.paymentMethods}>
          {item.paymentMethods.map((m, i) => (
            <View key={i} style={styles.methodBadge}>
              <CreditCard size={12} color={COLORS.textMuted} />
              <Text style={styles.methodText}>{m}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={[styles.tradeButton, { backgroundColor: item.type === 'SELL' ? COLORS.primary : COLORS.secondary }]}>
          <Text style={styles.tradeButtonText}>{item.type === 'SELL' ? 'Buy' : 'Sell'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={TYPOGRAPHY.h2}>P2P Market</Text>
        <TouchableOpacity style={styles.historyBtn}>
          <Text style={styles.historyBtnText}>My Trades</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={COLORS.textMuted} />
          <TextInput 
            placeholder="Search assets or users..." 
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterIconButton}>
          <Filter size={20} color={COLORS.textPrimary} />
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
          data={offers.filter(o => o.type === filter)}
          renderItem={renderOffer}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchOffers}
          refreshing={loading}
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
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: 4,
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
