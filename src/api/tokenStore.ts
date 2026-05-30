import * as Keychain from 'react-native-keychain';

const TOKENS_SERVICE = 'cryptofy_tokens';
const DEVICE_SERVICE = 'cryptofy_device';

export type StoredTokens = {
  accessToken: string;
  refreshToken: string;
};

function randomHex(bytes: number) {
  const buf = new Uint8Array(bytes);
  // react-native-get-random-values polyfills global.crypto.getRandomValues
  (global as any).crypto.getRandomValues(buf);
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function getOrCreateDeviceId(): Promise<string> {
  const existing = await Keychain.getGenericPassword({ service: DEVICE_SERVICE });
  if (existing) return existing.password;
  const deviceId = `dev_${randomHex(16)}`;
  await Keychain.setGenericPassword('device', deviceId, { service: DEVICE_SERVICE, accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED });
  return deviceId;
}

export async function setTokens(tokens: StoredTokens): Promise<void> {
  await Keychain.setGenericPassword('tokens', JSON.stringify(tokens), {
    service: TOKENS_SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
  });
}

export async function getTokens(): Promise<StoredTokens | null> {
  const stored = await Keychain.getGenericPassword({ service: TOKENS_SERVICE });
  if (!stored) return null;
  try {
    return JSON.parse(stored.password);
  } catch {
    return null;
  }
}

export async function clearTokens(): Promise<void> {
  await Keychain.resetGenericPassword({ service: TOKENS_SERVICE });
}
