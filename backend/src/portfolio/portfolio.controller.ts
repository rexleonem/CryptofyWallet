import { Controller, Get, Param } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('assets/supported')
  async getSupportedAssets() {
    return this.portfolioService.getSupportedAssets();
  }

  @Get(':address')
  async getSummary(@Param('address') address: string) {
    return this.portfolioService.getSummary(address);
  }

  @Get('history/:address')
  async getHistory(@Param('address') address: string) {
    return this.portfolioService.getHistory(address);
  }
}
