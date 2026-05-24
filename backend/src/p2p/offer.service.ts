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

    return offers;
  }

  async findOne(id: string) {
    return this.prisma.offer.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }
}
