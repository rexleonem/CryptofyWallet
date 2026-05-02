import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { WalletsModule } from './wallets/wallets.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [AuthModule, WalletsModule, PortfolioModule, AiModule],
})
export class AppModule {}
