import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.subtitle}>How we handle your information</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.h}>Overview</Text>
          <Text style={styles.p}>
            Cryptofy is built to help you access and manage digital assets with a secure, modern experience. This policy
            explains what we collect, why we collect it, and how you can control it.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.h}>What We Collect</Text>
          <Text style={styles.p}>
            We may collect account identifiers (like email), device and session metadata, and product usage signals needed
            to keep your account secure and the platform reliable.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.h}>Security</Text>
          <Text style={styles.p}>
            We use encryption and access controls to protect sensitive information. You can enable additional safeguards
            such as biometrics and authenticator-based verification where available.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.h}>Your Controls</Text>
          <Text style={styles.p}>
            You can review your profile details, sign out of devices, and manage verification settings within the app.
            You may also request access or deletion where required by applicable law.
          </Text>
        </View>

        <Text style={styles.footerNote}>Last updated: June 1, 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  title: { ...TYPOGRAPHY.h2, fontSize: 22 },
  subtitle: { ...TYPOGRAPHY.small, color: COLORS.textMuted, marginTop: 4 },
  content: { padding: SPACING.l, paddingBottom: SPACING.xxl },
  card: {
    backgroundColor: 'rgba(16,24,42,0.86)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: SPACING.l,
    marginBottom: SPACING.m,
  },
  h: { color: COLORS.textPrimary, fontWeight: '900', fontSize: 15, marginBottom: 8 },
  p: { color: COLORS.textSecondary, lineHeight: 20, fontSize: 13 },
  footerNote: { ...TYPOGRAPHY.small, color: COLORS.textMuted, textAlign: 'center', marginTop: 6 },
});

