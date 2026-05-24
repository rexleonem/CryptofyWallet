import { Injectable, ServiceUnavailableException } from '@nestjs/common';
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
        slow: ethers.formatEther(standardFee * 8n / 10n),
        standard: ethers.formatEther(standardFee),
        fast: ethers.formatEther(standardFee * 12n / 10n),
      };
    } catch (error) {
      throw new ServiceUnavailableException('Live network fee unavailable');
    }
  }

  async requestWithdrawal(input: {
    userId: string;
    asset: string;
    network: string;
    to: string;
    amount: string;
    deviceId?: string;
  }) {
    if (!ethers.isAddress(input.to)) {
      throw new Error('Invalid recipient address');
    }

    return {
      id: `wd_${Date.now()}`,
      status: 'UNDER_REVIEW',
      asset: input.asset,
      network: input.network,
      to: input.to,
      amount: input.amount,
      policy: {
        deviceSessionChecked: Boolean(input.deviceId),
        rateLimitChecked: true,
        withdrawalConfirmationRequired: true,
        signedOnMobile: false,
      },
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
    return [];
  }
}
