import { apiClient } from './client';

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  wallets?: Array<{ address?: string | null }>;
}

export async function authenticateWithEmail(input: {
  email: string;
  password: string;
  name?: string;
}): Promise<AuthUser> {
  const response = await apiClient.post('/auth/login', input);
  return response.data;
}
