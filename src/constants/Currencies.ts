export interface Currency {
  id: string;
  name: string;
  symbol: string;
  color: string;
  icon?: string;
  decimals: number;
  contractAddress?: string;
  isNative?: boolean;
}

export const CURRENCIES: Currency[] = [
  {
    id: 'ETH',
    name: 'Ethereum',
    symbol: 'ETH',
    color: '#627EEA',
    isNative: true,
    decimals: 18,
  },
  {
    id: 'CFYC',
    name: 'Cryptofy Coin',
    symbol: 'CFYC',
    color: '#4F7CFF',
    isNative: false,
    decimals: 18,
    contractAddress: '0xCFYC...MOCK', // Replace with real contract address if available
  },
  {
    id: 'CHUSD',
    name: 'Cherokee USD',
    symbol: 'CHUSD',
    color: '#10B981',
    isNative: false,
    decimals: 6,
    contractAddress: '0xCHUSD...MOCK', // Replace with real contract address if available
  },
];
