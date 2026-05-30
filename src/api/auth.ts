import { apiClient } from './client';
import { getOrCreateDeviceId, setTokens } from './tokenStore';

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  wallets?: Array<{ address?: string | null }>;
}

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export async function loginWithEmail(input: { email: string; password: string }): Promise<AuthResponse> {
  const deviceId = await getOrCreateDeviceId();
  const response = await apiClient.post('/auth/login', { ...input, deviceId });
  const data = response.data as AuthResponse;
  await setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
}

export async function signUpWithEmail(input: { email: string; password: string; name?: string }): Promise<AuthResponse> {
  const deviceId = await getOrCreateDeviceId();
  const response = await apiClient.post('/auth/signup', { ...input, deviceId });
  const data = response.data as AuthResponse;
  await setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
}
