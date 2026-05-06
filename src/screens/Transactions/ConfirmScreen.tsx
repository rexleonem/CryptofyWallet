import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useWalletStore } from '../../store/walletStore';
import { retrieveMnemonic } from '../../wallet/keystore';
import { deriveWalletFromMnemonic } from '../../wallet/signer';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { ethers } from 'ethers';
import { ALCHEMY_URL } from '../../constants/chains';

export default function ConfirmScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { recipient, amount, gasFee } = route.params;
  const { address } = useWalletStore();

  const [countdown, setCountdown] = useState(3);
  const [isSending, setIsSending] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (isPressing && countdown === 0) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          handleConfirm();
        }
      });
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [isPressing, countdown]);

  const widthInterpolate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const handleConfirm = async () => {
    setIsSending(true);
    try {
      const mnemonic = await retrieveMnemonic();
      if (!mnemonic) throw new Error('Wallet not found');

      const wallet = deriveWalletFromMnemonic(mnemonic);
      const provider = new ethers.JsonRpcProvider(ALCHEMY_URL);
      const signer = wallet.connect(provider);

      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount),
      });

      Alert.alert(
        'Success',
        'Transaction broadcasted! Check history for status.',
        [{ text: 'OK', onPress: () => navigation.navigate('Main') }]
      );
    } catch (error: any) {
      Alert.alert('Transaction Failed', error.message || 'Unknown error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Confirm Transaction</Text>
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          Double-check recipient address. Transactions cannot be reversed.
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>From:</Text>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="middle">{address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>To:</Text>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="middle">{recipient}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountValue}>{amount} ETH</Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Network Fee</Text>
          <Text style={styles.amountValue}>{gasFee} ETH</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            {(parseFloat(amount) + parseFloat(gasFee)).toFixed(6)} ETH
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={[styles.button, countdown > 0 && styles.disabledButton]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPressIn={() => setIsPressing(true)}
            onPressOut={() => setIsPressing(false)}
            disabled={countdown > 0 || isSending}
          >
            <Animated.View style={[styles.progressOverlay, { width: widthInterpolate }]} />
            <View style={styles.buttonContent}>
              {isSending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>
                  {countdown > 0 ? `Wait (${countdown})` : isPressing ? 'Hold to Confirm...' : 'Hold to Send'}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isSending}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.l,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
  },
  warningBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  warningText: {
    color: COLORS.warning,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.l,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    width: 60,
  },
  value: {
    color: COLORS.textPrimary,
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: SPACING.m,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  amountValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  totalLabel: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 'auto',
  },
  button: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.m,
  },
  progressOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  buttonContent: {
    flex: 1,
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
  cancelButton: {
    alignSelf: 'center',
    padding: SPACING.m,
  },
  cancelText: {
    color: COLORS.error,
    fontSize: 16,
  },
});
