import * as Keychain from 'react-native-keychain';

const SERVICE = 'com.cryptofy.wallet';

export async function storeMnemonic(mnemonic: string): Promise<void> {
  await Keychain.setGenericPassword('mnemonic', mnemonic, {
    service: SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
  });
}

export async function retrieveMnemonic(): Promise<string | null> {
  const result = await Keychain.getGenericPassword({ service: SERVICE });
  return result ? result.password : null;
}

export async function deleteMnemonic(): Promise<void> {
  await Keychain.resetGenericPassword({ service: SERVICE });
}
