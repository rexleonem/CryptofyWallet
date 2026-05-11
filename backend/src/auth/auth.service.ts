import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(email: string) {
    let user = await this.prisma.user.findUnique({
      where: { email },
      include: { wallets: true },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: { email },
        include: { wallets: true },
      });
    }

    return user;
  }

  async getUser(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { wallets: true },
    });
  }
}
