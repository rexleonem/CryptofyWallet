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

export const CURRENCIES: Currency[] = [];
