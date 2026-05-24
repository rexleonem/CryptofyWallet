import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(input: { email: string; password: string; name?: string }) {
    const email = input.email?.trim().toLowerCase();
    const password = input.password || '';
    const name = input.name?.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('A valid email address is required.');
    }

    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters.');
    }

    let user = await this.prisma.user.findUnique({
      where: { email },
      include: { wallets: true },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: { email, name },
        include: { wallets: true },
      });
    } else if (name && user.name !== name) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { name },
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
