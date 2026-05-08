import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';

export default function OnboardingScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Image 
          source={require('../../assets/cfywallet-logo-white.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.middleSection}>
        <Text style={styles.headline}>Take control of your crypto</Text>
        <Text style={styles.subtext}>Secure. Private. Intelligent.</Text>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('CreateWallet')}
        >
          <Text style={styles.buttonText}>Create Wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('ImportWallet')}
        >
          <Text style={[styles.buttonText, { color: COLORS.primary }]}>Import Wallet</Text>
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
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 100,
  },
  middleSection: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    ...TYPOGRAPHY.h1,
    textAlign: 'center',
    marginBottom: SPACING.base,
  },
  subtext: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
  },
  bottomSection: {
    flex: 3,
    justifyContent: 'flex-end',
    paddingBottom: SPACING.xl,
  },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});
