import { apiClient } from './client';

export interface P2POffer {
  id: string;
  type: 'BUY' | 'SELL';
  asset: string;
  price: number;
  minAmount: number;
  maxAmount: number;
  paymentMethods: string[];
  user: {
    name: string;
    rating: number;
    trades: number;
  };
}

export const fetchP2POffers = async (asset?: string, type?: string): Promise<P2POffer[]> => {
  try {
    const response = await apiClient.get('/p2p/offers', {
      params: { asset, type }
    });
    return response.data;
  } catch (error) {
    console.error('Fetch P2P Offers Error:', error);
    return [];
  }
};

export const fetchUserTrades = async (userId: string) => {
  try {
    const response = await apiClient.get(`/p2p/trades/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch User Trades Error:', error);
    return [];
  }
};
