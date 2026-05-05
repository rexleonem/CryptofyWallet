import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
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
    // Pick 3 random indices to verify
    const indices = [2, 6, 10]; // For demo, let's pick 3, 7, 11 (0-indexed 2, 6, 10)
    setIndicesToVerify(indices);
    
    // Create a pool of 6 random words for options
    const pool = [...words].sort(() => Math.random() - 0.5).slice(0, 8);
    setOptions(pool);
  }, []);

  const handleSelect = (word: string) => {
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.l,
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
  },
  optionButton: {
    width: '48%',
    height: 48,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  optionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  footer: {
    marginTop: 'auto',
  },
  clearButton: {
    alignSelf: 'center',
    marginBottom: SPACING.m,
  },
  clearText: {
    color: COLORS.error,
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
