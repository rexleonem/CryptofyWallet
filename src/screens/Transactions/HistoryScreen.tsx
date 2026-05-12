import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TransactionCard from '../../components/TransactionCard';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { useWalletStore } from '../../store/walletStore';
import { apiClient } from '../../api/client';

export default function HistoryScreen() {
  const navigation = useNavigation();
  const { address } = useWalletStore();
  const [history, setHistory] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await apiClient.get(`/transaction/history/${address}`);
      setHistory(response.data as any[]);
    } catch (error) {
      console.error('History Fetch Error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <View style={{ width: 50 }} />
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionCard 
            type={item.type}
            address={item.to || item.from}
            amount={item.amount}
            status={item.status}
            timestamp={item.timestamp}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
      />
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
    padding: SPACING.m,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 20,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  listContent: {
    padding: SPACING.l,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
});
