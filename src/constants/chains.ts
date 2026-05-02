export const ALCHEMY_URL = process.env.ALCHEMY_API_KEY 
  ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}` 
  : 'https://eth-mainnet.g.alchemy.com/v2/demo';

export const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
