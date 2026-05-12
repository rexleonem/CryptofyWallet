import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { WalletsModule } from './wallets/wallets.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AiModule } from './ai/ai.module';
import { PrismaModule } from './prisma/prisma.module';
import { P2pModule } from './p2p/p2p.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    WalletsModule,
    PortfolioModule,
    AiModule,
    PrismaModule,
    P2pModule,
    BlockchainModule,
    TransactionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
