import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
  };
}

const P2PMarketplace = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const baseUrl = (typeof process !== 'undefined' && process.env?.API_BASE_URL) || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/p2p/offers`);
      const data = await response.json();
      setOffers(data as Offer[]);
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
        <Text style={[styles.typeBadge, item.type === 'SELL' ? styles.sellBadge : styles.buyBadge]}>
          {item.type}
        </Text>
        <Text style={styles.assetText}>{item.asset}</Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Price:</Text>
        <Text style={styles.priceValue}>${item.price.toLocaleString()}</Text>
      </View>

      <View style={styles.limitRow}>
        <Text style={styles.limitText}>Limits: ${item.minAmount} - ${item.maxAmount}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.userName}>{item.user?.name || 'Anonymous'}</Text>
        <TouchableOpacity style={styles.tradeButton}>
          <Text style={styles.tradeButtonText}>{item.type === 'SELL' ? 'Buy' : 'Sell'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>P2P Marketplace</Text>
      <FlatList
        data={offers}
        renderItem={renderOffer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={fetchOffers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 16,
    color: '#1A1A1A',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 8,
  },
  buyBadge: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
  },
  sellBadge: {
    backgroundColor: '#FBE9E7',
    color: '#D84315',
  },
  assetText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  limitRow: {
    marginBottom: 12,
  },
  limitText: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  userName: {
    fontSize: 14,
    color: '#666',
  },
  tradeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  tradeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default P2PMarketplace;
