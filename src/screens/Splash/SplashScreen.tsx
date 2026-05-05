import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../../store/walletStore';
import { retrieveMnemonic } from '../../wallet/keystore';
import { getAddressFromMnemonic } from '../../wallet/signer';
import { COLORS } from '../../constants/Theme';

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const { setAddress, setUnlocked } = useWalletStore();

  useEffect(() => {
    checkWallet();
  }, []);

  const checkWallet = async () => {
    try {
      const mnemonic = await retrieveMnemonic();
      if (mnemonic) {
        const address = getAddressFromMnemonic(mnemonic);
        setAddress(address);
        setUnlocked(true);
        navigation.replace('Main');
      } else {
        navigation.replace('Onboarding');
      }
    } catch (error) {
      console.error('Splash Check Error:', error);
      navigation.replace('Onboarding');
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../../assets/cfywallet-logo-white.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator color={COLORS.primary} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 100,
  },
  loader: {
    marginTop: 20,
  },
});
