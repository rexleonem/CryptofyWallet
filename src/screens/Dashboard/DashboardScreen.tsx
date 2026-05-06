import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl, Clipboard, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../../store/walletStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { apiClient } from '../../api/client';

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { address, setAddress, setUnlocked } = useWalletStore();
  const [balance, setBalance] = useState({ eth: '0.00', usd: '0.00' });
  const [refreshing, setRefreshing] = useState(false);

  const fetchBalance = async () => {
    if (!address) return;
    try {
      // We use the safe fetch wrapper I created earlier or apiClient if axios is installed
      // For now, let's assume we use the backend endpoint
      const response = await fetch(`http://localhost:3000/wallets/balance/${address}`);
      const jsonData = await response.json();
      const data = jsonData as { balance?: string; usd?: number };
      setBalance({
        eth: data.balance || '0.00',
        usd: data.usd?.toLocaleString() || '0.00'
      });
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

  const logout = () => {
    setAddress('');
    setUnlocked(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <View style={styles.header}>
          <Image 
            source={require('../../../assets/cfywallet-logo-white.png')} 
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('PortfolioHome')} style={{ marginRight: 16 }}>
              <Text style={styles.portfolioLinkText}>Portfolio</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.balanceUsd}>${balance.usd}</Text>
          <Text style={styles.balanceEth}>≈ {balance.eth} ETH</Text>
        </View>

        <TouchableOpacity style={styles.addressCard} onPress={copyAddress}>
          <View>
            <Text style={styles.addressLabel}>Wallet Address</Text>
            <Text style={styles.addressValue} numberOfLines={1} ellipsizeMode="middle">
              {address}
            </Text>
          </View>
          <View style={styles.copyBadge}>
            <Text style={styles.copyText}>Copy</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate('Send')}
          >
            <Text style={styles.actionButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate('Receive')}
          >
            <Text style={styles.actionButtonText}>Receive</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>History</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {/* Short preview of history could go here */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Assets</Text>
        </View>
        
        <View style={styles.assetCard}>
          <View style={styles.assetIcon}>
            <Text style={styles.assetIconText}>Ξ</Text>
          </View>
          <View style={styles.assetInfo}>
            <Text style={styles.assetName}>Ethereum</Text>
            <Text style={styles.assetSymbol}>ETH</Text>
          </View>
          <View style={styles.assetBalance}>
            <Text style={styles.assetValueText}>{balance.eth} ETH</Text>
            <Text style={styles.assetUsdText}>${balance.usd}</Text>
          </View>
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
  scrollContent: {
    padding: SPACING.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  headerLogo: {
    width: 120,
    height: 40,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 14,
  },
  portfolioLinkText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  balanceUsd: {
    ...TYPOGRAPHY.balance,
  },
  balanceEth: {
    ...TYPOGRAPHY.body,
    marginTop: 4,
  },
  addressCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  addressLabel: {
    ...TYPOGRAPHY.small,
    marginBottom: 4,
  },
  addressValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    width: 200,
  },
  copyBadge: {
    backgroundColor: 'rgba(79, 124, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  actionButton: {
    flex: 0.48,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledAction: {
    backgroundColor: COLORS.card,
    opacity: 0.5,
  },
  actionButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 20,
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  assetCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.m,
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3C3C3D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  assetIconText: {
    color: 'white',
    fontSize: 20,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  assetSymbol: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  assetBalance: {
    alignItems: 'flex-end',
  },
  assetValueText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  assetUsdText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});
