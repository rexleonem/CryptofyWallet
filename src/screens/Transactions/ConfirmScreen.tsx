import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import TextIcon from '../../components/TextIcon';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { useAccountStore } from '../../store/walletStore';

export default function ConfirmScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { recipient, amount, gasFee, speed, assetSymbol } = route.params;
  const { depositAddress } = useAccountStore();
  const [countdown, setCountdown] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: isPressing && countdown === 0 ? 1 : 0,
      duration: isPressing && countdown === 0 ? 1800 : 180,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && isPressing && countdown === 0) {
        handleConfirm();
      }
    });
  }, [countdown, isPressing, progress]);

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Withdrawal submitted',
        'Cryptofy is reviewing this transfer with your security settings before submission.',
        [{ text: 'Done', onPress: () => navigation.navigate('Main') }],
      );
    }, 900);
  };

  const widthInterpolate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Withdrawal review</Text>

      <View style={styles.securityBox}>
        <TextIcon label="OK" size={14} color={COLORS.success} />
        <Text style={styles.securityText}>Protected by risk checks, device verification, and withdrawal review.</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>From account</Text>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="middle">{depositAddress || 'Unavailable'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Recipient</Text>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="middle">{recipient}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountValue}>{amount} {assetSymbol || ''}</Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Network speed</Text>
          <Text style={styles.amountValue}>{speed}</Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Estimated fee</Text>
          <Text style={styles.amountValue}>{gasFee}</Text>
        </View>
      </View>

      <View style={styles.deviceCard}>
        <TextIcon label="D" size={18} color={COLORS.primaryLight} />
        <Text style={styles.deviceText}>Device session, withdrawal limits, and confirmation policy will be enforced before chain submission.</Text>
      </View>

      <View style={styles.footer}>
        <View style={[styles.button, countdown > 0 && styles.disabledButton]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPressIn={() => setIsPressing(true)}
            onPressOut={() => setIsPressing(false)}
            disabled={countdown > 0 || isSubmitting}
          >
            <Animated.View style={[styles.progressOverlay, { width: widthInterpolate }]} />
            <View style={styles.buttonContent}>
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>
                  {countdown > 0 ? `Reviewing (${countdown})` : isPressing ? 'Hold to submit...' : 'Hold to request withdrawal'}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={isSubmitting}>
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
  headerTitle: {
    ...TYPOGRAPHY.h2,
    textAlign: 'center',
    marginBottom: SPACING.l,
  },
  securityBox: {
    flexDirection: 'row',
    gap: SPACING.s,
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderRadius: 18,
    padding: SPACING.m,
    marginBottom: SPACING.l,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.18)',
  },
  securityText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: SPACING.l,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    marginBottom: SPACING.m,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  value: {
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.m,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  amountLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  amountValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  deviceCard: {
    flexDirection: 'row',
    gap: SPACING.s,
    padding: SPACING.m,
    borderRadius: 18,
    backgroundColor: 'rgba(10,132,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.16)',
    marginTop: SPACING.m,
  },
  deviceText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    marginTop: 'auto',
  },
  button: {
    height: 60,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: SPACING.m,
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  buttonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.52,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
  cancelButton: {
    alignSelf: 'center',
    padding: SPACING.m,
  },
  cancelText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '700',
  },
});
