import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useWalletStore } from '../../store/walletStore';

export default function DashboardScreen() {
  const { address, setAddress, setUnlocked } = useWalletStore();

  const logout = () => {
    setAddress('');
    setUnlocked(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.address}>Wallet: {address}</Text>
      <Text style={styles.balance}>$0.00</Text>
      
      <Button title="Logout" onPress={logout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold' },
  address: { fontSize: 12, color: '#666', marginTop: 10, marginBottom: 20 },
  balance: { fontSize: 48, fontWeight: 'bold', marginVertical: 30 }
});
