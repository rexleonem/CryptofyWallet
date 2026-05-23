import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import TextIcon from '../../components/TextIcon';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { useAccountStore } from '../../store/walletStore';

export default function AuthScreen() {
  const navigation = useNavigation<any>();
  const signIn = useAccountStore((state) => state.signIn);
  const [email, setEmail] = useState('rex@cryptofy.ai');
  const [password, setPassword] = useState('');

  const completeAuth = () => {
    signIn(email || 'rex@cryptofy.ai', 'Rex');
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Image source={require('../../assets/cfywallet-logo-white.png')} style={styles.logo} resizeMode="contain" />

          <View style={styles.hero}>
            <View style={styles.aiBadge}>
              <TextIcon label="*" size={14} color={COLORS.primaryLight} />
              <Text style={styles.aiBadgeText}>AI-powered digital asset banking</Text>
            </View>
            <Text style={styles.title}>Your financial operating system</Text>
            <Text style={styles.subtitle}>
              Sign in normally. Cryptofy securely manages wallet infrastructure while you control every movement.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrap}>
              <TextIcon label="@" size={18} color={COLORS.textMuted} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Email address"
                placeholderTextColor={COLORS.textMuted}
                style={styles.input}
              />
            </View>
            <View style={styles.inputWrap}>
              <TextIcon label="*" size={18} color={COLORS.textMuted} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Password"
                placeholderTextColor={COLORS.textMuted}
                style={styles.input}
              />
            </View>

            <TouchableOpacity activeOpacity={0.86} onPress={completeAuth}>
              <LinearGradient colors={['#0A84FF', '#3B82F6']} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Continue securely</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.oauthRow}>
              <TouchableOpacity style={styles.oauthButton} onPress={completeAuth}>
                <Text style={styles.oauthText}>G</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.oauthButton} onPress={completeAuth}>
                <Text style={styles.oauthText}>A</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.oauthButton} onPress={completeAuth}>
                <Text style={[styles.oauthText, { color: COLORS.primaryLight }]}>ID</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.securityStrip}>
            <TextIcon label="OK" size={14} color={COLORS.success} />
            <Text style={styles.securityText}>No seed phrases. No private keys on this device. Protected by device sessions and withdrawal review.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flexGrow: 1,
    padding: SPACING.l,
    justifyContent: 'space-between',
  },
  logo: {
    width: 148,
    height: 56,
    marginTop: SPACING.m,
  },
  hero: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  aiBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(10,132,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.18)',
    marginBottom: SPACING.l,
  },
  aiBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    ...TYPOGRAPHY.h1,
    fontSize: 38,
    lineHeight: 44,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.m,
    color: COLORS.textSecondary,
  },
  form: {
    gap: SPACING.m,
  },
  inputWrap: {
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    gap: 12,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  primaryButton: {
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  oauthRow: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  oauthButton: {
    flex: 1,
    height: 52,
    borderRadius: 17,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oauthText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  securityStrip: {
    marginTop: SPACING.xl,
    flexDirection: 'row',
    gap: 10,
    padding: SPACING.m,
    borderRadius: 18,
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.16)',
  },
  securityText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});
