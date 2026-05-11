import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { Shield, Smartphone, Zap, ArrowRight } from 'lucide-react-native';

export default function OnboardingScreen() {
  const navigation = useNavigation<any>();

  const Feature = ({ icon: Icon, title }: any) => (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>
        <Icon size={20} color={COLORS.primary} />
      </View>
      <Text style={styles.featureText}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topSection}>
        <Image 
          source={require('../../assets/cfywallet-logo-white.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.middleSection}>
        <Text style={styles.headline}>The future of crypto is here</Text>
        <Text style={styles.subtext}>Manage your assets with ease, security, and intelligence.</Text>
        
        <View style={styles.featuresList}>
          <Feature icon={Shield} title="Military-grade security" />
          <Feature icon={Zap} title="Instant transactions" />
          <Feature icon={Smartphone} title="Cross-chain support" />
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('CreateWallet')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <ArrowRight size={20} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('ImportWallet')}
        >
          <Text style={styles.secondaryButtonText}>I already have a wallet</Text>
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
  topSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 80,
  },
  middleSection: {
    flex: 5,
    paddingTop: SPACING.xl,
  },
  headline: {
    ...TYPOGRAPHY.h1,
    fontSize: 36,
    lineHeight: 44,
    marginBottom: SPACING.m,
  },
  subtext: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginBottom: SPACING.xl,
  },
  featuresList: {
    gap: SPACING.m,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  bottomSection: {
    flex: 3,
    justifyContent: 'flex-end',
    paddingBottom: SPACING.xl,
  },
  primaryButton: {
    height: 64,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.m,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  secondaryButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});
