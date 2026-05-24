import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { ethers } from 'ethers';
import { PORTFOLIO_CACHE_TTL, SUPPORTED_ASSETS, SUPPORTED_PORTFOLIO_CHAINS } from '../common/constants';

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

    const chains = SUPPORTED_PORTFOLIO_CHAINS;
    const allTokens = [];

    try {
      for (const chain of chains) {
        const provider = this.blockchainService.getProvider(chain);
        const balanceWei = await provider.getBalance(address).catch(() => 0n);
        const balanceEth = parseFloat(ethers.formatEther(balanceWei));
        
        if (balanceEth > 0) {
          allTokens.push({
            symbol: chain === 'POLYGON' ? 'MATIC' : chain === 'BSC' ? 'BNB' : 'ETH',
            name: chain === 'POLYGON' ? 'Polygon' : chain === 'BSC' ? 'Binance' : 'Ethereum',
            amount: balanceEth.toFixed(4),
            value: null,
            change24h: null,
            price: null,
            chain
          });
        }
      }

      const result = {
        totalValue: null,
        change24h: null,
        tokens: allTokens,
      };

      this.cache.set(address, { data: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      return {
        totalValue: null,
        change24h: null,
        tokens: [],
      };
    }
  }

  async getHistory(address: string) {
    return [];
  }

  getSupportedAssets() {
    return SUPPORTED_ASSETS;
  }
}
