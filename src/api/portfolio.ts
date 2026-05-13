import { apiClient } from './client';

export interface TokenAsset {
  symbol: string;
  name: string;
  amount: string;
  value: string;
  change24h: number;
  price: string;
  chain: string;
}

export interface PortfolioSummary {
  totalValue: string;
  change24h: number;
  tokens: TokenAsset[];
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
  try {
    const response = await apiClient.get(`/portfolio/history/${address}`);
    return response.data;
  } catch (error) {
    console.error('Fetch History Error:', error);
    return [0, 0, 0, 0, 0, 0, 0];
  }
};
