import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useAccountStore } from '../../store/walletStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { APP_VERSION, APP_BUILD } from '../../constants/Config';
import TextIcon from '../../components/TextIcon';

export default function SettingsScreen() {
  const { depositAddress, email, name, signOut } = useAccountStore();

  const logout = () => {
    signOut();
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
            <TextIcon label="R" size={28} color={COLORS.primary} />
          </View>
          <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
            {name} {email ? `- ${email}` : ''}
          </Text>
          <Text style={styles.custodyText} numberOfLines={1} ellipsizeMode="middle">{depositAddress}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account</Text>
          <SettingItem icon="S" title="Security & Privacy" onPress={() => {}} />
          <SettingItem icon="D" title="Device sessions" value="1 active" onPress={() => {}} />
          <SettingItem icon="!" title="Notifications" value="On" onPress={() => {}} />
          <SettingItem icon="L" title="Biometric unlock" value="Enabled" onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Support</Text>
          <SettingItem icon="C" title="Custody & withdrawals" value="Protected" onPress={() => {}} />
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
  addressText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    width: '90%',
    textAlign: 'center',
  },
  custodyText: {
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
});
