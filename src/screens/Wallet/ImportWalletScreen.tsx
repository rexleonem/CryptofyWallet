import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../../store/walletStore';
import { storeMnemonic } from '../../wallet/keystore';
import { getAddressFromMnemonic } from '../../wallet/signer';
import { validateMnemonic } from '../../wallet/bip39';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';

export default function ImportWalletScreen() {
  const navigation = useNavigation<any>();
  const [phrase, setPhrase] = useState('');
  const { setAddress, setUnlocked } = useWalletStore();

  const handleImport = async () => {
    const cleanPhrase = phrase.trim().toLowerCase();
    
    if (!validateMnemonic(cleanPhrase)) {
      Alert.alert('Invalid Phrase', 'The recovery phrase you entered is invalid. Please check the words and order.');
      return;
    }

    try {
      await storeMnemonic(cleanPhrase);
      const address = getAddressFromMnemonic(cleanPhrase);
      setAddress(address);
      setUnlocked(true);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to import wallet');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Import Wallet</Text>
        <Text style={styles.subtitle}>Enter your 12-word recovery phrase to restore your assets.</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          multiline
          placeholder="word1 word2 word3..."
          placeholderTextColor={COLORS.textSecondary}
          value={phrase}
          onChangeText={setPhrase}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, !phrase.trim() && styles.disabledButton]}
          disabled={!phrase.trim()}
          onPress={handleImport}
        >
          <Text style={styles.buttonText}>Restore Wallet</Text>
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
  inputContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.m,
    height: 150,
    borderWidth: 1,
    borderColor: 'rgba(79, 124, 255, 0.3)',
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
  },
  footer: {
    marginTop: 'auto',
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
