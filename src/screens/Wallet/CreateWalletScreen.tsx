import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { generateMnemonic } from '../../wallet/bip39';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';

export default function CreateWalletScreen() {
  const navigation = useNavigation<any>();
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const phrase = generateMnemonic();
    setMnemonic(phrase.split(' '));
    
    // Enable button after 3 seconds to ensure user looks at phrase
    const timer = setTimeout(() => setCanContinue(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Seed Phrase</Text>
        <Text style={styles.subtitle}>Write down these 12 words in order and keep them safe.</Text>

        <View style={styles.phraseGrid}>
          {mnemonic.map((word, index) => (
            <View key={index} style={styles.wordCard}>
              <Text style={styles.wordIndex}>{index + 1}</Text>
              <Text style={styles.wordText}>{word}</Text>
            </View>
          ))}
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Never share your recovery phrase. Store it securely offline.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, !canContinue && styles.disabledButton]}
          disabled={!canContinue}
          onPress={() => navigation.navigate('VerifyPhrase', { mnemonic: mnemonic.join(' ') })}
        >
          <Text style={styles.buttonText}>I've saved it</Text>
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
  scrollContent: {
    padding: SPACING.l,
  },
  title: {
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.base,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.xl,
  },
  phraseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  wordCard: {
    width: '31%',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.base,
    marginBottom: SPACING.m,
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordIndex: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    marginRight: 6,
    width: 15,
  },
  wordText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  warningBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.warning,
    borderRadius: 12,
    padding: SPACING.m,
  },
  warningText: {
    color: COLORS.warning,
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    padding: SPACING.l,
  },
  button: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});
