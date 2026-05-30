import React, { useState } from 'react';
import { Alert, Modal, TextInput, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useAccountStore } from '../../store/walletStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { APP_VERSION, APP_BUILD } from '../../constants/Config';
import TextIcon from '../../components/TextIcon';
import { clearTokens } from '../../api/tokenStore';
import { mfaEnable, mfaSetup } from '../../api/mfa';

export default function SettingsScreen() {
  const { depositAddress, email, name, biometricEnabled, signOut } = useAccountStore();
  const profileInitial = (name?.trim()?.[0] || email?.trim()?.[0] || 'U').toUpperCase();
  const [mfaVisible, setMfaVisible] = useState(false);
  const [otpAuth, setOtpAuth] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState('');

  const logout = async () => {
    await clearTokens();
    signOut();
  };

  const beginMfa = async () => {
    try {
      const data = await mfaSetup();
      setOtpAuth(data.otpauth);
      setMfaVisible(true);
    } catch (e: any) {
      Alert.alert('MFA setup failed', e?.response?.data?.message || 'Unable to start MFA setup.');
    }
  };

  const confirmMfa = async () => {
    try {
      await mfaEnable(mfaCode.trim());
      Alert.alert('MFA enabled', 'Authenticator verification is now required for withdrawals.');
      setMfaVisible(false);
      setOtpAuth(null);
      setMfaCode('');
    } catch (e: any) {
      Alert.alert('MFA verification failed', e?.response?.data?.message || 'Invalid code.');
    }
  };

  const SettingItem = ({ icon, title, value, onPress, color = COLORS.textPrimary }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <TextIcon label={icon} size={16} color={color} />
        </View>
        <Text style={[styles.itemTitle, { color }]}>{title}</Text>
      </View>
      <View style={styles.itemRight}>
        {value && <Text style={styles.itemValue}>{value}</Text>}
        <TextIcon label=">" size={18} color={COLORS.textMuted} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={TYPOGRAPHY.h2}>Settings</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profileInitial}</Text>
          </View>
          <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
            {name} {email ? `- ${email}` : ''}
          </Text>
          <Text style={styles.accountText} numberOfLines={1} ellipsizeMode="middle">
            {depositAddress || 'Deposit address unavailable'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account</Text>
          <SettingItem icon="S" title="Enable authenticator (MFA)" onPress={beginMfa} />
          <SettingItem icon="D" title="Device sessions" onPress={() => {}} />
          <SettingItem icon="!" title="Notifications" onPress={() => {}} />
          <SettingItem icon="L" title="Biometric unlock" value={biometricEnabled ? 'Enabled' : 'Off'} onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Support</Text>
          <SettingItem icon="C" title="Withdrawals" onPress={() => {}} />
          <SettingItem icon="?" title="Help Center" onPress={() => {}} />
          <SettingItem icon="*" title="About Cryptofy" onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <SettingItem 
            icon="X" 
            title="Log Out" 
            color={COLORS.error} 
            onPress={logout} 
          />
        </View>

        <Text style={styles.versionText}>Version {APP_VERSION} (Build {APP_BUILD})</Text>
      </ScrollView>

      <Modal visible={mfaVisible} transparent animationType="fade" onRequestClose={() => setMfaVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Enable Authenticator</Text>
            <Text style={styles.modalText}>
              Scan this setup string in your authenticator app, then enter the 6-digit code to confirm.
            </Text>
            {otpAuth ? <Text style={styles.otpText} numberOfLines={3}>{otpAuth}</Text> : null}
            <TextInput
              value={mfaCode}
              onChangeText={setMfaCode}
              placeholder="6-digit code"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              style={styles.modalInput}
            />
            <TouchableOpacity style={[styles.modalButton, mfaCode.trim().length < 6 && styles.modalButtonDisabled]} onPress={confirmMfa} disabled={mfaCode.trim().length < 6}>
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setMfaVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.l,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  scrollContent: {
    padding: SPACING.l,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    padding: SPACING.l,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    borderWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: '800',
  },
  addressText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    width: '90%',
    textAlign: 'center',
  },
  accountText: {
    ...TYPOGRAPHY.small,
    width: '90%',
    textAlign: 'center',
    color: COLORS.primaryLight,
    marginTop: 6,
  },
  section: {
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionLabel: {
    ...TYPOGRAPHY.label,
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.m,
    paddingBottom: SPACING.s,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.m,
    borderRadius: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  itemTitle: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginRight: SPACING.s,
  },
  versionText: {
    ...TYPOGRAPHY.small,
    textAlign: 'center',
    color: COLORS.textMuted,
    marginTop: SPACING.m,
    marginBottom: SPACING.xxl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: SPACING.l,
  },
  modalCard: {
    backgroundColor: 'rgba(16,24,42,0.96)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.18)',
    padding: SPACING.l,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  modalText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  otpText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  modalInput: {
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(5,8,22,0.46)',
    borderWidth: 1,
    borderColor: 'rgba(182,194,217,0.16)',
    paddingHorizontal: 12,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 12,
  },
  modalButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
  },
  modalCancel: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 6,
  },
  modalCancelText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '800',
  },
});
