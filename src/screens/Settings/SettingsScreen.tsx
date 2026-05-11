import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useWalletStore } from '../../store/walletStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { Settings as SettingsIcon, ChevronRight, Lock, Shield, Bell, CircleHelp, LogOut, User } from 'lucide-react-native';

export default function SettingsScreen() {
  const { address, setAddress, setUnlocked } = useWalletStore();

  const logout = () => {
    setAddress('');
    setUnlocked(false);
  };

  const SettingItem = ({ icon: Icon, title, value, onPress, color = COLORS.textPrimary }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Icon size={20} color={color} />
        </View>
        <Text style={[styles.itemTitle, { color }]}>{title}</Text>
      </View>
      <View style={styles.itemRight}>
        {value && <Text style={styles.itemValue}>{value}</Text>}
        <ChevronRight size={20} color={COLORS.textMuted} />
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
            <User size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
            {address}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account</Text>
          <SettingItem icon={Shield} title="Security & Privacy" onPress={() => {}} />
          <SettingItem icon={Bell} title="Notifications" value="On" onPress={() => {}} />
          <SettingItem icon={Lock} title="App Lock" value="Enabled" onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Support</Text>
          <SettingItem icon={CircleHelp} title="Help Center" onPress={() => {}} />
          <SettingItem icon={SettingsIcon} title="About Cryptofy" onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <SettingItem 
            icon={LogOut} 
            title="Log Out" 
            color={COLORS.error} 
            onPress={logout} 
          />
        </View>

        <Text style={styles.versionText}>Version 1.0.0 (Build 12)</Text>
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
    width: 200,
    textAlign: 'center',
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
