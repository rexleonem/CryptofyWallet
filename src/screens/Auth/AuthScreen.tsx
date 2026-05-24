import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import AnimatedGradientBackground from '../../components/backgrounds/AnimatedGradientBackground';
import TextIcon from '../../components/TextIcon';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { useAccountStore } from '../../store/walletStore';

type AuthMode = 'login' | 'signup';

type AnimatedButtonProps = {
  children: React.ReactNode;
  onPress: () => void;
  style?: object;
};

function AnimatedPressable({ children, onPress, style }: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.98, { duration: 120, easing: Easing.out(Easing.cubic) });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.cubic) });
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export default function AuthScreen() {
  const navigation = useNavigation<any>();
  const signIn = useAccountStore((state) => state.signIn);
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const logoGlow = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const cardLift = useSharedValue(18);

  useEffect(() => {
    logoGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.cubic) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.cubic) }),
      ),
      -1,
      false,
    );
    contentOpacity.value = withDelay(140, withTiming(1, { duration: 760, easing: Easing.out(Easing.cubic) }));
    cardLift.value = withDelay(220, withTiming(0, { duration: 820, easing: Easing.out(Easing.cubic) }));
  }, [cardLift, contentOpacity, logoGlow]);

  const completeAuth = (guest = false) => {
    signIn(guest ? 'guest@cryptofy.ai' : email.trim(), guest ? 'Guest' : fullName.trim());
    navigation.replace('Main');
  };

  const logoStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: (1 - contentOpacity.value) * 8 }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.18 + logoGlow.value * 0.22,
    transform: [{ scale: 0.92 + logoGlow.value * 0.16 }],
  }));

  const copyStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: (1 - contentOpacity.value) * 12 }],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: cardLift.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedGradientBackground intensity="calm" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.logoWrap, logoStyle]}>
            <Animated.View style={[styles.logoGlow, glowStyle]} />
            <Image source={require('../../assets/cfywallet-logo-white.png')} style={styles.logo} resizeMode="contain" />
          </Animated.View>

          <Animated.View style={[styles.hero, copyStyle]}>
            <Text style={styles.title}>AI-Powered Crypto Intelligence</Text>
            <Text style={styles.subtitle}>
              Track, understand, and grow your digital assets with real-time intelligence.
            </Text>
          </Animated.View>

          <Animated.View style={[styles.authCard, cardStyle]}>
            <View style={styles.modeRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.modeButton, mode === 'login' && styles.activeMode]}
                onPress={() => setMode('login')}
              >
                <Text style={[styles.modeText, mode === 'login' && styles.activeModeText]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.modeButton, mode === 'signup' && styles.activeMode]}
                onPress={() => setMode('signup')}
              >
                <Text style={[styles.modeText, mode === 'signup' && styles.activeModeText]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {mode === 'signup' && (
              <View style={styles.inputWrap}>
                <TextIcon label="ID" size={12} color={COLORS.textMuted} />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Full name"
                  placeholderTextColor={COLORS.textMuted}
                  style={styles.input}
                />
              </View>
            )}

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

            <AnimatedPressable onPress={() => completeAuth()} style={styles.ctaWrap}>
              <LinearGradient colors={['#0A84FF', '#3B82F6']} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>{mode === 'login' ? 'Login' : 'Create Account'}</Text>
              </LinearGradient>
            </AnimatedPressable>

            <AnimatedPressable onPress={() => setMode(mode === 'login' ? 'signup' : 'login')} style={styles.ctaWrap}>
              <View style={styles.outlineButton}>
                <Text style={styles.outlineButtonText}>{mode === 'login' ? 'Create Account' : 'I already have an account'}</Text>
              </View>
            </AnimatedPressable>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.socialButton} activeOpacity={0.84} onPress={() => completeAuth()}>
              <Text style={styles.socialMark}>G</Text>
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.84} onPress={() => completeAuth()}>
                <Text style={styles.socialMark}>A</Text>
                <Text style={styles.socialText}>Continue with Apple</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.guestButton} activeOpacity={0.82} onPress={() => completeAuth(true)}>
              <Text style={styles.guestText}>Continue as Guest</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.securityStrip, copyStyle]}>
            <TextIcon label="OK" size={13} color={COLORS.success} />
            <Text style={styles.securityText}>Secure access. Smart insights. Simple control.</Text>
          </Animated.View>
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
    paddingTop: SPACING.xl,
    justifyContent: 'space-between',
  },
  logoWrap: {
    alignSelf: 'center',
    width: 190,
    height: 118,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.s,
  },
  logoGlow: {
    position: 'absolute',
    width: 168,
    height: 82,
    borderRadius: 42,
    backgroundColor: '#A5D8FF',
    shadowColor: '#A5D8FF',
    shadowOpacity: 0.65,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
  },
  logo: {
    width: 160,
    height: 82,
  },
  hero: {
    alignItems: 'center',
    marginTop: SPACING.l,
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h1,
    textAlign: 'center',
    fontSize: 32,
    lineHeight: 38,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    maxWidth: 330,
    textAlign: 'center',
    marginTop: SPACING.m,
    color: 'rgba(230,238,255,0.76)',
  },
  authCard: {
    borderRadius: 30,
    padding: SPACING.m,
    backgroundColor: 'rgba(16,24,42,0.62)',
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.22)',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.24,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 18 },
    gap: SPACING.m,
  },
  modeRow: {
    flexDirection: 'row',
    gap: SPACING.s,
    padding: 4,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  modeButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeMode: {
    backgroundColor: 'rgba(165,216,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.22)',
  },
  modeText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '800',
  },
  activeModeText: {
    color: COLORS.white,
  },
  inputWrap: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: 'rgba(5,8,22,0.46)',
    borderWidth: 1,
    borderColor: 'rgba(182,194,217,0.16)',
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
  ctaWrap: {
    borderRadius: 20,
  },
  primaryButton: {
    height: 58,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.42,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900',
  },
  outlineButton: {
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.28)',
  },
  outlineButtonText: {
    color: COLORS.primaryLight,
    fontSize: 15,
    fontWeight: '900',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  socialButton: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.11)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  socialMark: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900',
  },
  socialText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: SPACING.s,
  },
  guestText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '800',
  },
  securityStrip: {
    marginTop: SPACING.xl,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: 999,
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.16)',
  },
  securityText: {
    color: 'rgba(230,238,255,0.72)',
    fontSize: 12,
    fontWeight: '700',
  },
});
