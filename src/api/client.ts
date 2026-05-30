import axios from 'axios';
import { API_BASE_URL, DEV_API_BASE_URL } from '@env';
import { clearTokens, getOrCreateDeviceId, getTokens, setTokens } from './tokenStore';

// Base URL for the NestJS backend
const BASE_URL = __DEV__ ? (DEV_API_BASE_URL || 'http://10.0.2.2:3000') : API_BASE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const tokens = await getTokens();
  if (tokens?.accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

let refreshing: Promise<string | null> | null = null;

apiClient.interceptors.response.use(
  (r) => r,
  async (error) => {
    const status = error?.response?.status;
    const original = error?.config;
    if (status !== 401 || !original || original.__isRetry) {
      throw error;
    }

    const tokens = await getTokens();
    if (!tokens?.refreshToken) {
      throw error;
    }

    if (!refreshing) {
      refreshing = (async () => {
        try {
          const deviceId = await getOrCreateDeviceId();
          const res = await axios.post(
            `${BASE_URL}/auth/refresh`,
            { refreshToken: tokens.refreshToken, deviceId },
            { timeout: 10000 },
          );
          const next = res.data as { accessToken: string; refreshToken: string };
          await setTokens(next);
          return next.accessToken;
        } catch {
          await clearTokens();
          return null;
        } finally {
          refreshing = null;
        }
      })();
    }

    const newAccess = await refreshing;
    if (!newAccess) {
      throw error;
    }

    original.__isRetry = true;
    original.headers = original.headers || {};
    original.headers.Authorization = `Bearer ${newAccess}`;
    return apiClient(original);
  },
);
