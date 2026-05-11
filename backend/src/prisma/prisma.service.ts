import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const url = process.env.DATABASE_URL;
    if (!url) {
      console.error('❌ DATABASE_URL is not defined in environment variables');
    }
    
    super();
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Connected to Database successfully');
    } catch (error) {
      console.error('❌ Failed to connect to Database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
