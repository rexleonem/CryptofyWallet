import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useWalletStore } from '../../store/walletStore';
import { storeMnemonic } from '../../wallet/keystore';
import { getAddressFromMnemonic } from '../../wallet/signer';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';

export default function VerifyPhraseScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { mnemonic } = route.params;
  const words = mnemonic.split(' ');
  const { setAddress, setUnlocked } = useWalletStore();

  const [indicesToVerify, setIndicesToVerify] = useState<number[]>([]);
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    // Pick 3 unique random indices to verify
    const totalWords = words.length;
    const indices: number[] = [];
    while (indices.length < 3) {
      const r = Math.floor(Math.random() * totalWords);
      if (indices.indexOf(r) === -1) indices.push(r);
    }
    setIndicesToVerify(indices.sort((a, b) => a - b));
    
    // Create a pool of ALL words for options, shuffled
    const pool = [...words].sort(() => Math.random() - 0.5);
    setOptions(pool);
  }, []);

  const handleSelect = (word: string) => {
    // Find the first empty verification slot
    const nextIndex = indicesToVerify.find(idx => !selections[idx]);
    if (nextIndex !== undefined) {
      setSelections({ ...selections, [nextIndex]: word });
    }
  };

  const clearSelection = () => setSelections({});

  const handleVerify = async () => {
    const isCorrect = indicesToVerify.every(idx => selections[idx] === words[idx]);
    
    if (isCorrect) {
      try {
        await storeMnemonic(mnemonic);
        const address = getAddressFromMnemonic(mnemonic);
        setAddress(address);
        setUnlocked(true);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to secure wallet');
      }
    } else {
      Alert.alert('Wrong Words', 'The words you selected do not match your phrase. Please try again.');
      setSelections({});
    }
  };

  const isComplete = indicesToVerify.every(idx => !!selections[idx]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Verify Phrase</Text>
          <Text style={styles.subtitle}>Select the correct words to confirm you've saved them.</Text>
        </View>

        <View style={styles.verificationArea}>
          {indicesToVerify.map((idx) => (
            <View key={idx} style={styles.verifyRow}>
              <Text style={styles.indexLabel}>Word #{idx + 1}:</Text>
              <View style={styles.selectedWordBox}>
                <Text style={styles.selectedWordText}>{selections[idx] || '???'}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.optionsGrid}>
          {options.map((word, i) => (
            <TouchableOpacity 
              key={i} 
              style={styles.optionButton}
              onPress={() => handleSelect(word)}
            >
              <Text style={styles.optionText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={clearSelection} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, !isComplete && styles.disabledButton]}
            disabled={!isComplete}
            onPress={handleVerify}
          >
            <Text style={styles.buttonText}>Verify & Complete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    flexGrow: 1,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.base,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
  verificationArea: {
    marginBottom: SPACING.xl,
  },
  verifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  indexLabel: {
    ...TYPOGRAPHY.body,
    width: 100,
    color: COLORS.textPrimary,
  },
  selectedWordBox: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  selectedWordText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  optionButton: {
    width: '31%',
    height: 44,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: SPACING.l,
  },
  clearButton: {
    alignSelf: 'center',
    marginBottom: SPACING.m,
  },
  clearText: {
    color: COLORS.error,
    fontWeight: '600',
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
