import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { ethers } from 'ethers';
import { PORTFOLIO_CACHE_TTL, MOCK_PRICES, MOCK_24H_CHANGES, MOCK_HISTORY } from '../common/constants';

@Injectable()
export class PortfolioService {
  private cache = new Map<string, { data: any, timestamp: number }>();
  private CACHE_TTL = PORTFOLIO_CACHE_TTL;

  constructor(private blockchainService: BlockchainService) {}

  async getSummary(address: string) {
    const cached = this.cache.get(address);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    const chains = ['ETH', 'POLYGON', 'BSC'];
    let totalPortfolioValue = 0;
    const allTokens = [];

    try {
      for (const chain of chains) {
        const provider = this.blockchainService.getProvider(chain);
        const balanceWei = await provider.getBalance(address).catch(() => 0n);
        const balanceEth = parseFloat(ethers.formatEther(balanceWei));
        
        // Use chain-specific pricing mock
        const price = MOCK_PRICES[chain] || 0;
        const value = balanceEth * price;
        
        if (balanceEth > 0) {
          allTokens.push({
            symbol: chain === 'POLYGON' ? 'MATIC' : chain === 'BSC' ? 'BNB' : 'ETH',
            name: chain === 'POLYGON' ? 'Polygon' : chain === 'BSC' ? 'Binance' : 'Ethereum',
            amount: balanceEth.toFixed(4),
            value: value.toFixed(2),
            change24h: MOCK_24H_CHANGES[chain] || 0,
            price: price.toFixed(2),
            chain
          });
          totalPortfolioValue += value;
        }
      }

      // Add dummy tokens if portfolio is empty for better UI demonstration
      if (allTokens.length === 0) {
          allTokens.push({ symbol: 'ETH', name: 'Ethereum', amount: '0.0000', value: '0.00', change24h: 0, price: MOCK_PRICES['ETH'].toString(), chain: 'ETH' });
      }

      const result = {
        totalValue: totalPortfolioValue.toFixed(2),
        change24h: 5.23,
        tokens: allTokens,
      };

      this.cache.set(address, { data: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      return {
        totalValue: '0.00',
        change24h: 0,
        tokens: [],
      };
    }
  }

  async getHistory(address: string) {
    // Daily snapshots for the last 7 days
    return MOCK_HISTORY;
  }
}
