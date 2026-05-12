export const PORTFOLIO_CACHE_TTL = 30000;
export const DEFAULT_USER_PLAN = 'FREE';

export const MOCK_PRICES: Record<string, number> = {
  ETH: 2960.00,
  POLYGON: 0.72,
  BSC: 610.00,
};

export const MOCK_24H_CHANGES: Record<string, number> = {
  ETH: 4.2,
  POLYGON: -1.5,
  BSC: 0.5,
};

export const MOCK_HISTORY = [
  { time: 'Mon', value: 4200 },
  { time: 'Tue', value: 4350 },
  { time: 'Wed', value: 4100 },
  { time: 'Thu', value: 4500 },
  { time: 'Fri', value: 4800 },
  { time: 'Sat', value: 4700 },
  { time: 'Sun', value: 4892.10 },
];
