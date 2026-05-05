import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { WalletsModule } from './wallets/wallets.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AiModule } from './ai/ai.module';
import { PrismaModule } from './prisma/prisma.module';
import { P2pModule } from './p2p/p2p.module';

@Module({
  imports: [
    AuthModule,
    WalletsModule,
    PortfolioModule,
    AiModule,
    PrismaModule,
    P2pModule,
  ],
})
export class AppModule {}
