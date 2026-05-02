import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useWalletStore } from '../../store/walletStore';
import { generateMnemonic, validateMnemonic } from '../../wallet/bip39';
import { getAddressFromMnemonic } from '../../wallet/signer';
import { storeMnemonic } from '../../wallet/keystore';

export default function OnboardingScreen() {
  const { setAddress, setUnlocked } = useWalletStore();
  const [mnemonic, setMnemonic] = useState('');

  const createWallet = async () => {
    const phrase = generateMnemonic();
    setMnemonic(phrase);
    const address = getAddressFromMnemonic(phrase);
    await storeMnemonic(phrase);
    setAddress(address);
    setUnlocked(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Cryptofy</Text>
      <Text style={styles.subtitle}>Your AI-powered portfolio brain</Text>
      
      <Button title="Create New Wallet" onPress={createWallet} />
      
      {mnemonic ? (
        <Text style={styles.mnemonic}>Your phrase (save this): {mnemonic}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  mnemonic: { marginTop: 20, padding: 10, backgroundColor: '#eee', borderRadius: 8 }
});
