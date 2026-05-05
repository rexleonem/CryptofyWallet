import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Clipboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { useWalletStore } from '../../store/walletStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';

export default function ReceiveScreen() {
  const navigation = useNavigation();
  const { address } = useWalletStore();

  const copyAddress = () => {
    Clipboard.setString(address || '');
    Alert.alert('Copied', 'Address copied to clipboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receive ETH</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.qrContainer}>
          <QRCode
            value={address || ''}
            size={220}
            color={COLORS.textPrimary}
            backgroundColor="transparent"
          />
        </View>

        <Text style={styles.instruction}>Scan address to receive ETH</Text>

        <View style={styles.addressCard}>
          <Text style={styles.addressLabel}>Your Ethereum Address</Text>
          <Text style={styles.addressValue}>{address}</Text>
          
          <TouchableOpacity style={styles.copyButton} onPress={copyAddress}>
            <Text style={styles.copyText}>Copy Address</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={() => Alert.alert('Share', 'Share functionality coming soon')}>
          <Text style={styles.shareText}>Share Address</Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.l,
    justifyContent: 'center',
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: SPACING.m,
    borderRadius: 20,
    marginBottom: SPACING.l,
  },
  instruction: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.xl,
  },
  addressCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.l,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  addressLabel: {
    ...TYPOGRAPHY.small,
    marginBottom: 8,
  },
  addressValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.m,
    fontSize: 14,
  },
  copyButton: {
    backgroundColor: 'rgba(79, 124, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  copyText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  shareButton: {
    marginTop: SPACING.xl,
  },
  shareText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
