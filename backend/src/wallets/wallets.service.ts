import { Injectable, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { PrismaService } from '../prisma/prisma.service';
import { encryptWithMasterKey } from '../common/crypto';

@Injectable()
export class WalletsService {
  private provider: ethers.JsonRpcProvider | null;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {
    const apiKey = this.configService.get<string>('ALCHEMY_API_KEY');
    this.provider = apiKey
      ? new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${apiKey}`)
      : null;
  }

  async getBalance(address: string) {
    if (!ethers.isAddress(address)) {
      throw new BadRequestException('Invalid Ethereum address');
    }
    if (!this.provider) {
      throw new BadRequestException('Live wallet balance provider unavailable');
    }

    try {
      const balanceWei = await this.provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      
      return {
        balance: parseFloat(balanceEth).toFixed(4),
        usd: null,
      };
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  async createWallet(userId: string, label = 'Cryptofy Account', network = 'ethereum') {
    const wallet = ethers.Wallet.createRandom();
    let encryptedPrivateKey: string | null = null;
    try {
      const payload = encryptWithMasterKey(wallet.privateKey, 1);
      encryptedPrivateKey = JSON.stringify(payload);
    } catch {
      throw new ServiceUnavailableException('Vault master key not configured');
    }

    return this.prisma.wallet.create({
      data: {
        userId,
        address: wallet.address,
        label,
        network,
        custodyProvider: 'LOCAL_VAULT',
        keyVersion: 1,
        encryptedPrivateKey,
      },
    });
  }

  async getAccountProfile(userId: string) {
    const wallets = await this.findByUserId(userId);

    return {
      userId,
      policy: {
        privateKeysExposedToMobile: false,
        withdrawalReview: true,
        deviceSessionRequired: true,
        rateLimitedTransactions: true,
      },
      wallets,
    };
  }

  async findByUserId(userId: string) {
    return this.prisma.wallet.findMany({
      where: { userId },
    });
  }
}
