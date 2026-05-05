import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { ethers } from 'ethers';

@Injectable()
export class TransactionService {
  constructor(private blockchainService: BlockchainService) {}

  async getGasEstimate(to: string, amount: string) {
    const provider = this.blockchainService.getProvider();
    
    try {
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice || 0n;
      
      // Standard ETH transfer uses 21,000 gas
      const standardGasLimit = 21000n;
      const standardFee = standardGasLimit * gasPrice;

      return {
        slow: ethers.formatEther(standardFee * 8n / 10n) + ' ETH',
        standard: ethers.formatEther(standardFee) + ' ETH',
        fast: ethers.formatEther(standardFee * 12n / 10n) + ' ETH',
      };
    } catch (error) {
      return {
        slow: '0.001 ETH',
        standard: '0.002 ETH',
        fast: '0.003 ETH',
      };
    }
  }

  async broadcast(signedTx: string) {
    const tx = await this.blockchainService.broadcastTransaction(signedTx);
    return {
      hash: tx.hash,
      status: 'pending',
    };
  }

  async getStatus(hash: string) {
    const receipt = await this.blockchainService.getTransactionReceipt(hash);
    if (!receipt) return { status: 'pending' };
    return {
      status: receipt.status === 1 ? 'confirmed' : 'failed',
      blockNumber: receipt.blockNumber,
    };
  }

  async getHistory(address: string) {
    // In a real app, we'd use Etherscan or an indexer.
    // For this stage, we'll return a mock history that fits the UI design.
    return [
      {
        id: '1',
        type: 'send',
        to: '0xA3f...91D2',
        amount: '0.05',
        status: 'pending',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'receive',
        from: '0xB8...21A9',
        amount: '0.12',
        status: 'confirmed',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      }
    ];
  }
}
