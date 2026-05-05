import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainService {
  private providers: Map<string, ethers.JsonRpcProvider> = new Map();

  constructor() {
    const alchemyKey = process.env.ALCHEMY_API_KEY || '3xqHZz7DfKWBhtl4NHhQM';
    
    this.providers.set('ETH', new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`));
    this.providers.set('POLYGON', new ethers.JsonRpcProvider(`https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}`));
    this.providers.set('BSC', new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org/'));
  }

  getProvider(chain = 'ETH') {
    return this.providers.get(chain) || this.providers.get('ETH');
  }

  async callWithRetry(fn: () => Promise<any>, retries = 3, delay = 1000): Promise<any> {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.callWithRetry(fn, retries - 1, delay * 2);
    }
  }

  async getGasPrice() {
    return this.callWithRetry(() => this.getProvider().getFeeData());
  }

  async broadcastTransaction(signedTx: string) {
    return this.callWithRetry(() => this.getProvider().broadcastTransaction(signedTx));
  }

  async getTransactionReceipt(hash: string) {
    return this.callWithRetry(() => this.getProvider().getTransactionReceipt(hash));
  }
}
