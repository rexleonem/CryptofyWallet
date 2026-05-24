import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useWalletStore } from '../../store/walletStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { apiClient } from '../../api/client';
import InsightCard from '../../components/InsightCard';
import RiskBadge from '../../components/RiskBadge';

export default function InsightsDetailScreen() {
  const navigation = useNavigation<any>();
  const { address } = useWalletStore();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aiData, setAiData] = useState<any>(null);

  const fetchAiInsights = async () => {
    if (!address) {
      setAiData(null);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const response = await apiClient.get(`/ai/portfolio/${address}`);
      setAiData(response.data);
    } catch (error) {
      console.error('AI Fetch Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAiInsights();
  }, [address]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAiInsights();
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Insights</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Overall Assessment</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTitle}>Portfolio Analysis</Text>
            {aiData?.riskLevel ? <RiskBadge level={aiData.riskLevel} /> : null}
          </View>
          <Text style={styles.summaryText}>
            {aiData?.riskLevel && typeof aiData?.riskScore === 'number'
              ? `Live analysis returned a ${aiData.riskLevel} risk profile with a risk score of ${aiData.riskScore}/100.`
              : 'AI service unavailable'}
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Key Findings</Text>
        </View>

        {aiData?.insights.map((insight: any, i: number) => (
          <InsightCard 
            key={i}
            type={insight.type}
            title={insight.title}
            message={insight.message}
            severity={insight.severity}
          />
        ))}

        {(!aiData?.insights || aiData.insights.length === 0) && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No insights available yet.</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.m,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 18,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  scrollContent: {
    padding: SPACING.l,
  },
  summaryBox: {
    backgroundColor: 'rgba(79, 124, 255, 0.05)',
    borderRadius: 24,
    padding: SPACING.l,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(79, 124, 255, 0.2)',
  },
  summaryLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  summaryTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 22,
  },
  summaryText: {
    ...TYPOGRAPHY.body,
    lineHeight: 20,
  },
  sectionHeader: {
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 20,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
});
