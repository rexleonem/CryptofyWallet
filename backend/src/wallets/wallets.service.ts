import { Injectable, BadRequestException } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class WalletsService {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    const apiKey = process.env.ALCHEMY_API_KEY || '3xqHZz7DfKWBhtl4NHhQM';
    const rpcUrl = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  async getBalance(address: string) {
    if (!ethers.isAddress(address)) {
      throw new BadRequestException('Invalid Ethereum address');
    }

    try {
      const balanceWei = await this.provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      
      // For demo purposes, we'll use a hardcoded price of ETH. 
      // In Stage 3, we will integrate CoinMarketCap API.
      const ethPrice = 2500; 
      const balanceUsd = parseFloat(balanceEth) * ethPrice;

      return {
        balance: parseFloat(balanceEth).toFixed(4),
        usd: balanceUsd,
      };
    } catch (error) {
      console.error('Error fetching balance:', error);
      return {
        balance: '0.0000',
        usd: 0,
      };
    }
  }
}
