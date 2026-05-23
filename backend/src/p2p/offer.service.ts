import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assuming PrismaService exists in root/prisma
import { OfferType } from '@prisma/client';

@Injectable()
export class OfferService {
  constructor(private prisma: PrismaService) {}

  async createOffer(data: {
    userId: String;
    type: OfferType;
    asset: string;
    price: number;
    minAmount: number;
    maxAmount: number;
    paymentMethods: string[];
  }) {
    return this.prisma.offer.create({
      data: {
        userId: data.userId as string,
        type: data.type,
        asset: data.asset,
        price: data.price,
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
        paymentMethods: data.paymentMethods,
      },
    });
  }

  async findAll(filters: { asset?: string; type?: OfferType }) {
    const offers = await this.prisma.offer.findMany({
      where: {
        asset: filters.asset,
        type: filters.type,
        status: 'ACTIVE',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (offers.length === 0 && !filters.asset && !filters.type) {
      return this.getDemoOffers();
    }

    return offers;
  }

  private getDemoOffers() {
    return [
      {
        id: 'demo-offer-1',
        type: 'SELL',
        asset: 'ETH',
        price: 2650.40,
        minAmount: 100,
        maxAmount: 5000,
        paymentMethods: ['Bank Transfer', 'PayPal'],
        user: { name: 'CryptoWhale', rating: 4.9, trades: 1250 },
        status: 'ACTIVE'
      },
      {
        id: 'demo-offer-2',
        type: 'BUY',
        asset: 'BTC',
        price: 48200.00,
        minAmount: 500,
        maxAmount: 20000,
        paymentMethods: ['Revolut', 'Wise'],
        user: { name: 'SatoshiFan', rating: 5.0, trades: 3400 },
        status: 'ACTIVE'
      },
      {
        id: 'demo-offer-3',
        type: 'SELL',
        asset: 'USDT',
        price: 1.01,
        minAmount: 10,
        maxAmount: 10000,
        paymentMethods: ['Bank Transfer', 'Zelle'],
        user: { name: 'StableTrader', rating: 4.8, trades: 890 },
        status: 'ACTIVE'
      },
      {
        id: 'demo-offer-4',
        type: 'SELL',
        asset: 'BNB',
        price: 312.50,
        minAmount: 50,
        maxAmount: 2000,
        paymentMethods: ['Crypto Wallet', 'Binance Pay'],
        user: { name: 'BNBKing', rating: 4.7, trades: 120 },
        status: 'ACTIVE'
      }
    ];
  }

  async findOne(id: string) {
    if (id.startsWith('demo-offer-')) {
      return this.getDemoOffers().find(o => o.id === id);
    }
    return this.prisma.offer.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }
}
