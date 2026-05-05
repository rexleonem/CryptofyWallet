import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EscrowService } from './escrow.service';
import { TradeStatus } from '@prisma/client';

@Injectable()
export class TradeService {
  constructor(
    private prisma: PrismaService,
    private escrow: EscrowService,
  ) {}

  async initiateTrade(data: {
    offerId: string;
    buyerId: string;
    amount: number;
  }) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: data.offerId },
    });

    if (!offer || offer.status !== 'ACTIVE') {
      throw new BadRequestException('Offer not available');
    }

    if (data.amount < offer.minAmount || data.amount > offer.maxAmount) {
      throw new BadRequestException('Amount out of bounds');
    }

    return this.prisma.trade.create({
      data: {
        offerId: data.offerId,
        buyerId: data.buyerId,
        sellerId: offer.userId,
        amount: data.amount,
        status: TradeStatus.OPEN,
      },
    });
  }

  async updateStatus(tradeId: string, status: TradeStatus, txHash?: string) {
    return this.prisma.trade.update({
      where: { id: tradeId },
      data: { 
        status,
        ...(txHash && { escrowTxHash: txHash })
      },
    });
  }

  async findUserTrades(userId: string) {
    return this.prisma.trade.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId },
        ],
      },
      include: {
        offer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async lockTradeEscrow(tradeId: string) {
    const trade = await this.prisma.trade.findUnique({
      where: { id: tradeId },
      include: { offer: true },
    });

    if (!trade || trade.status !== TradeStatus.OPEN) {
      throw new BadRequestException('Trade not in valid state for escrow');
    }

    const txHash = await this.escrow.lockEscrow(
      trade.id,
      trade.amount,
      trade.sellerId,
    );

    return this.updateStatus(tradeId, TradeStatus.LOCKED, txHash);
  }

  async completeTrade(tradeId: string) {
    const trade = await this.prisma.trade.findUnique({
      where: { id: tradeId },
    });

    if (!trade || trade.status !== TradeStatus.PAID) {
      throw new BadRequestException('Trade must be PAID before completion');
    }

    const txHash = await this.escrow.releaseEscrow(trade.id, trade.buyerId);
    return this.updateStatus(tradeId, TradeStatus.COMPLETED, txHash);
  }
}
