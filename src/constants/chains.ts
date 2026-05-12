import { ALCHEMY_API_KEY as ENV_ALCHEMY_KEY, CMC_API_KEY as ENV_CMC_KEY, CMC_BASE_URL as ENV_CMC_URL } from '@env';

export const ALCHEMY_API_KEY = ENV_ALCHEMY_KEY || '3xqHZz7DfKWBhtl4NHhQM';
export const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

export const CMC_API_KEY = ENV_CMC_KEY || '08eeeeac-0281-4611-b43f-9b1c39b809f7';
export const CMC_BASE_URL = ENV_CMC_URL || 'https://pro-api.coinmarketcap.com/v1';
