import { apiClient } from './client';
import { getOrCreateDeviceId } from './tokenStore';

export async function mfaSetup(): Promise<{ otpauth: string }> {
  const deviceId = await getOrCreateDeviceId();
  const res = await apiClient.post('/auth/mfa/setup', { deviceId });
  return res.data;
}

export async function mfaEnable(code: string): Promise<{ ok: boolean }> {
  const deviceId = await getOrCreateDeviceId();
  const res = await apiClient.post('/auth/mfa/enable', { deviceId, code });
  return res.data;
}

