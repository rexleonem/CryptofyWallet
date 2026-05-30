import { Controller, ForbiddenException, Get, Param, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('portfolio')
@UseGuards(JwtAuthGuard)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('assets/supported')
  async getSupportedAssets() {
    return this.portfolioService.getSupportedAssets();
  }

  @Get(':address')
  async getSummary(@Param('address') address: string, @CurrentUser() user: any) {
    if (user.role !== 'ADMIN') {
      try {
        await this.portfolioService.assertWalletOwnership(user.sub, address);
      } catch {
        throw new ForbiddenException();
      }
    }
    return this.portfolioService.getSummary(address);
  }

  @Get('history/:address')
  async getHistory(@Param('address') address: string, @CurrentUser() user: any) {
    if (user.role !== 'ADMIN') {
      try {
        await this.portfolioService.assertWalletOwnership(user.sub, address);
      } catch {
        throw new ForbiddenException();
      }
    }
    return this.portfolioService.getHistory(address);
  }
}
