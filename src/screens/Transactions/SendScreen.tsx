import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ethers } from 'ethers';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import GasEstimateCard from '../../components/GasEstimateCard';

export default function SendScreen() {
  const navigation = useNavigation<any>();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [speed, setSpeed] = useState<'slow' | 'standard' | 'fast'>('standard');
  const [estimates, setEstimates] = useState({ slow: '0.0012', standard: '0.0021', fast: '0.0035' });
  const [isValidAddress, setIsValidAddress] = useState(false);

  useEffect(() => {
    setIsValidAddress(ethers.isAddress(recipient));
  }, [recipient]);

  const handleReview = () => {
    if (!isValidAddress) {
      Alert.alert('Invalid Address', 'Please enter a valid Ethereum address.');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter an amount greater than 0.');
      return;
    }

    navigation.navigate('ConfirmTransaction', {
      recipient,
      amount,
      gasFee: estimates[speed],
      speed
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send ETH</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>To:</Text>
          <View style={[styles.inputBox, recipient && !isValidAddress && styles.errorInput]}>
            <TextInput
              style={styles.input}
              placeholder="0x... address"
              placeholderTextColor={COLORS.textSecondary}
              value={recipient}
              onChangeText={setRecipient}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount:</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={[styles.input, { fontSize: 24, fontWeight: 'bold' }]}
              placeholder="0.00"
              placeholderTextColor={COLORS.textSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
            <TouchableOpacity style={styles.maxButton}>
              <Text style={styles.maxText}>MAX</Text>
            </TouchableOpacity>
          </View>
        </View>

        <GasEstimateCard 
          estimates={estimates} 
          selected={speed} 
          onSelect={setSpeed} 
        />

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>You send</Text>
            <Text style={styles.summaryValue}>{amount || '0'} ETH</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Gas Fee</Text>
            <Text style={styles.summaryValue}>{estimates[speed]} ETH</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {(parseFloat(amount || '0') + parseFloat(estimates[speed])).toFixed(6)} ETH
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, (!isValidAddress || !amount) && styles.disabledButton]}
          onPress={handleReview}
          disabled={!isValidAddress || !amount}
        >
          <Text style={styles.buttonText}>Review Transaction</Text>
        </TouchableOpacity>
      </View>
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
  scrollContent: {
    padding: SPACING.l,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    ...TYPOGRAPHY.small,
    fontWeight: 'bold',
    marginBottom: SPACING.base,
    color: COLORS.textPrimary,
  },
  inputBox: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: SPACING.m,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  errorInput: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  maxButton: {
    backgroundColor: 'rgba(79, 124, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  maxText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  summaryCard: {
    marginTop: SPACING.m,
    paddingTop: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  summaryValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  totalLabel: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    padding: SPACING.l,
  },
  button: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});
