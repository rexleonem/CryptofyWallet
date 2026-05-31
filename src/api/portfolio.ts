import { apiClient } from './client';
import { SUPPORTED_ASSETS } from '../constants/supportedAssets';

export interface TokenAsset {
  symbol: string;
  name: string;
  amount: string;
  value: string | null;
  change24h: number | null;
  price: string | null;
  chain: string;
}

export interface PortfolioSummary {
  totalValue: string | null;
  change24h: number | null;
  tokens: TokenAsset[];
}

export interface SupportedAsset {
  rank: number;
  symbol: string;
  name: string;
  coingeckoId: string | null;
  category: 'market' | 'cryptofy' | string;
}

export const fetchPortfolioSummary = async (address: string): Promise<PortfolioSummary> => {
  try {
    const response = await apiClient.get(`/portfolio/${address}`);
    return response.data;
  } catch (error) {
    console.error('Fetch Portfolio Error:', error);
    throw error;
  }
};

export const fetchPortfolioHistory = async (address: string): Promise<number[]> => {
  const response = await apiClient.get(`/portfolio/history/${address}`);
  return Array.isArray(response.data) ? response.data : [];
};

export const fetchSupportedAssets = async (): Promise<SupportedAsset[]> => {
  try {
    const response = await apiClient.get('/portfolio/assets/supported');
    return Array.isArray(response.data) && response.data.length > 0 ? response.data : SUPPORTED_ASSETS;
  } catch {
    return SUPPORTED_ASSETS;
  }
};

export async function addAssetToPortfolio(
  address: string,
  input: { symbol: string; amount: string; name?: string; chain?: string; coingeckoId?: string | null },
): Promise<{ ok: true; assets: any[] }> {
  const response = await apiClient.post(`/portfolio/${address}/assets`, input);
  return response.data;
}

export async function removeAssetFromPortfolio(address: string, symbol: string): Promise<{ ok: true; assets: any[] }> {
  const response = await apiClient.delete(`/portfolio/${address}/assets/${encodeURIComponent(symbol)}`);
  return response.data;
}
