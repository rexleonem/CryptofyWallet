import { BadRequestException, ForbiddenException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { ethers } from 'ethers';
import { PrismaService } from '../prisma/prisma.service';
import { authenticator } from 'otplib';
import { decryptWithMasterKey } from '../common/crypto';

@Injectable()
export class TransactionService {
  constructor(private blockchainService: BlockchainService, private prisma: PrismaService) {}

  async assertWalletOwnership(userId: string, address: string) {
    const wallet = await this.prisma.wallet.findFirst({ where: { userId, address } });
    if (!wallet) {
      throw new Error('Wallet not found for user');
    }
    return wallet;
  }

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
    idempotencyKey?: string;
    mfaCode?: string;
  }) {
    if (!ethers.isAddress(input.to)) {
      throw new BadRequestException('Invalid recipient address');
    }

    const amountNum = Number(input.amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      throw new BadRequestException('Invalid amount');
    }

    const chain = (input.network || '').toUpperCase();
    const asset = (input.asset || '').toUpperCase();
    if (!['ETH', 'POLYGON', 'BSC'].includes(chain)) {
      throw new BadRequestException('Unsupported network');
    }
    // Native asset withdrawals only for now.
    if (!['ETH', 'MATIC', 'BNB'].includes(asset)) {
      throw new BadRequestException('Unsupported asset');
    }

    if (!input.idempotencyKey || input.idempotencyKey.length < 12) {
      throw new BadRequestException('Idempotency key required');
    }

    const existing = await this.prisma.withdrawal.findUnique({
      where: { userId_idempotencyKey: { userId: input.userId, idempotencyKey: input.idempotencyKey } },
    });
    if (existing) {
      return existing;
    }

    const user = await this.prisma.user.findUnique({ where: { id: input.userId } });
    if (!user) throw new ForbiddenException();
    if (!user.mfaEnabled || !user.mfaSecretEnc) {
      throw new ForbiddenException('MFA must be enabled for withdrawals');
    }
    if (!input.mfaCode) {
      throw new ForbiddenException('MFA code required');
    }

    const mfaPayload = JSON.parse(user.mfaSecretEnc);
    const mfaSecret = decryptWithMasterKey(mfaPayload);
    const mfaOk = authenticator.check(input.mfaCode, mfaSecret);
    if (!mfaOk) throw new ForbiddenException('Invalid MFA code');

    const wallet = await this.prisma.wallet.findFirst({ where: { userId: input.userId, network: 'ethereum' } });
    if (!wallet || !wallet.encryptedPrivateKey) {
      throw new ServiceUnavailableException('Wallet unavailable');
    }

    const keyPayload = JSON.parse(wallet.encryptedPrivateKey);
    const privateKey = decryptWithMasterKey(keyPayload);

    const provider = this.blockchainService.getProvider(chain === 'POLYGON' ? 'POLYGON' : chain);
    const signer = new ethers.Wallet(privateKey, provider);

    const nonce = await provider.getTransactionCount(wallet.address, 'pending');
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice;
    if (!gasPrice) throw new ServiceUnavailableException('Network fee unavailable');

    const valueWei = ethers.parseEther(input.amount);
    const tx = {
      to: input.to,
      value: valueWei,
      nonce,
      gasLimit: 21_000n,
      gasPrice,
      chainId: (await provider.getNetwork()).chainId,
    };

    const created = await this.prisma.withdrawal.create({
      data: {
        userId: input.userId,
        walletAddress: wallet.address,
        asset,
        chain,
        to: input.to,
        amount: input.amount,
        idempotencyKey: input.idempotencyKey,
        status: 'PENDING',
      },
    });

    try {
      const sent = await signer.sendTransaction(tx);
      await this.prisma.withdrawal.update({
        where: { id: created.id },
        data: { txHash: sent.hash, status: 'BROADCAST' },
      });
      return { ...created, txHash: sent.hash, status: 'BROADCAST' };
    } catch (e) {
      await this.prisma.withdrawal.update({
        where: { id: created.id },
        data: { status: 'FAILED' },
      });
      throw e;
    }
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
    return this.prisma.withdrawal.findMany({
      where: { walletAddress: address },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
