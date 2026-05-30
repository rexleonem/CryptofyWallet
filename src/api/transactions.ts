import { apiClient } from './client';
import { getOrCreateDeviceId } from './tokenStore';

export async function requestWithdrawal(input: {
  asset: string;
  network: string;
  to: string;
  amount: string;
  idempotencyKey: string;
  mfaCode: string;
}) {
  const deviceId = await getOrCreateDeviceId();
  const res = await apiClient.post('/transaction/withdrawals', { ...input, deviceId });
  return res.data;
}

