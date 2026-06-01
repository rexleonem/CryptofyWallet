export const PORTFOLIO_CACHE_TTL = 30000;
export const DEFAULT_USER_PLAN = 'FREE';
export const SUPPORTED_PORTFOLIO_CHAINS = ['ETH', 'POLYGON', 'BSC'] as const;

export const SUPPORTED_ASSETS = [
  { rank: 1, symbol: 'BTC', name: 'Bitcoin', coingeckoId: 'bitcoin', category: 'market' },
  { rank: 2, symbol: 'ETH', name: 'Ethereum', coingeckoId: 'ethereum', category: 'market' },
  { rank: 3, symbol: 'USDT', name: 'Tether', coingeckoId: 'tether', category: 'market' },
  { rank: 4, symbol: 'XRP', name: 'XRP', coingeckoId: 'ripple', category: 'market' },
  { rank: 5, symbol: 'BNB', name: 'BNB', coingeckoId: 'binancecoin', category: 'market' },
  { rank: 6, symbol: 'SOL', name: 'Solana', coingeckoId: 'solana', category: 'market' },
  { rank: 7, symbol: 'USDC', name: 'USD Coin', coingeckoId: 'usd-coin', category: 'market' },
  { rank: 8, symbol: 'TRX', name: 'TRON', coingeckoId: 'tron', category: 'market' },
  { rank: 9, symbol: 'ADA', name: 'Cardano', coingeckoId: 'cardano', category: 'market' },
  { rank: 10, symbol: 'DOGE', name: 'Dogecoin', coingeckoId: 'dogecoin', category: 'market' },
  { rank: 11, symbol: 'CFYC', name: 'Cryptofy Coin', coingeckoId: null, category: 'cryptofy' },
  { rank: 12, symbol: '$CHERO', name: 'Cherokee Dollar', coingeckoId: null, category: 'cryptofy' },
  { rank: 13, symbol: 'USD', name: 'US Dollar', coingeckoId: null, category: 'fiat' },
  { rank: 14, symbol: 'EUR', name: 'Euro', coingeckoId: null, category: 'fiat' },
  { rank: 15, symbol: 'GBP', name: 'British Pound', coingeckoId: null, category: 'fiat' },
  { rank: 16, symbol: 'NGN', name: 'Nigerian Naira', coingeckoId: null, category: 'fiat' },
] as const;
