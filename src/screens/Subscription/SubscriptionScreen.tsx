import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';

export default function SubscriptionScreen() {
  const navigation = useNavigation();

  const plans = [
    {
      id: 'FREE',
      name: 'Free',
      price: '$0',
      features: ['Single chain (Ethereum)', 'Basic portfolio tracking', 'Daily AI insights limit'],
      color: COLORS.textSecondary
    },
    {
      id: 'PRO',
      name: 'Pro',
      price: '$12.99/mo',
      features: ['Multi-chain support', 'Unlimited AI Assistant', 'Advanced analytics', 'Real-time alerts'],
      color: COLORS.primary
    },
    {
      id: 'ELITE',
      name: 'Elite',
      price: '$29.99/mo',
      features: ['Priority AI response', 'Strategic buy/sell signals', 'Cross-wallet insights', 'Early feature access'],
      color: '#A855F7'
    }
  ];

  const handleSelectPlan = (plan: string) => {
    Alert.alert('Subscribe', `Starting subscription flow for ${plan} plan...`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upgrade Plan</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Choose your plan</Text>
        <Text style={styles.subtitle}>Unlock the full power of Cryptofy AI</Text>

        {plans.map((plan) => (
          <TouchableOpacity 
            key={plan.id} 
            style={[styles.planCard, { borderColor: plan.color + '40' }]}
            onPress={() => handleSelectPlan(plan.id)}
          >
            <View style={styles.planHeader}>
              <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
              <Text style={styles.planPrice}>{plan.price}</Text>
            </View>
            
            <View style={styles.featuresList}>
              {plan.features.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <Text style={[styles.featureDot, { color: plan.color }]}>•</Text>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.selectBtn, { backgroundColor: plan.color }]}>
              <Text style={styles.selectBtnText}>Select {plan.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  title: {
    ...TYPOGRAPHY.h1,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    color: COLORS.textSecondary,
  },
  planCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: SPACING.l,
    marginBottom: SPACING.xl,
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  featuresList: {
    marginBottom: SPACING.xl,
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  featureDot: {
    fontSize: 20,
    marginRight: 8,
  },
  featureText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  selectBtn: {
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
