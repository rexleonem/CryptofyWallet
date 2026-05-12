import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { PrismaService } from '../prisma/prisma.service';
import { MOCK_PRICES } from '../common/constants';

@Injectable()
export class WalletsService {
  private provider: ethers.JsonRpcProvider;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {
    const apiKey = this.configService.get<string>('ALCHEMY_API_KEY') || '3xqHZz7DfKWBhtl4NHhQM';
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
      
      const ethPrice = MOCK_PRICES['ETH'] || 2500; 
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

  async createWallet(userId: string, address: string, label: string, network = 'ethereum') {
    return this.prisma.wallet.create({
      data: {
        userId,
        address,
        label,
        network,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.wallet.findMany({
      where: { userId },
    });
  }
}
