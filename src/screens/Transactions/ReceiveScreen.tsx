import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useAccountStore } from '../../store/walletStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';

export default function ReceiveScreen() {
  const navigation = useNavigation();
  const { depositAddress } = useAccountStore();

  const copyAddress = () => {
    Clipboard.setString(depositAddress);
    Alert.alert('Copied', 'Deposit address copied to clipboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deposit assets</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.depositCode}>
          {Array.from({ length: 49 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.depositCodeCell,
                (index + depositAddress.charCodeAt(index % depositAddress.length)) % 3 !== 0 && styles.depositCodeCellActive,
              ]}
            />
          ))}
        </View>

        <Text style={styles.instruction}>Scan to deposit to your Cryptofy custody account</Text>

        <View style={styles.addressCard}>
          <Text style={styles.addressLabel}>Ethereum deposit address</Text>
          <Text style={styles.addressValue}>{depositAddress}</Text>
          
          <TouchableOpacity style={styles.copyButton} onPress={copyAddress}>
            <Text style={styles.copyText}>Copy deposit address</Text>
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
  depositCode: {
    width: 220,
    height: 220,
    backgroundColor: COLORS.white,
    padding: 18,
    borderRadius: 24,
    marginBottom: SPACING.l,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  depositCodeCell: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  depositCodeCellActive: {
    backgroundColor: COLORS.background,
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
