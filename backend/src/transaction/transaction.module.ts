import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [BlockchainModule, PrismaModule],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
