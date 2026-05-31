import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AddPortfolioAssetDto } from './dto';

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

  @Get(':address/assets')
  async listAssets(@Param('address') address: string, @CurrentUser() user: any) {
    if (user.role !== 'ADMIN') {
      await this.portfolioService.assertWalletOwnership(user.sub, address);
    }
    return this.portfolioService.listAssets(address);
  }

  @Post(':address/assets')
  async addAsset(@Param('address') address: string, @Body() dto: AddPortfolioAssetDto, @CurrentUser() user: any) {
    if (user.role !== 'ADMIN') {
      await this.portfolioService.assertWalletOwnership(user.sub, address);
    }
    return this.portfolioService.addAsset(address, dto);
  }

  @Delete(':address/assets/:symbol')
  async removeAsset(@Param('address') address: string, @Param('symbol') symbol: string, @CurrentUser() user: any) {
    if (user.role !== 'ADMIN') {
      await this.portfolioService.assertWalletOwnership(user.sub, address);
    }
    return this.portfolioService.removeAsset(address, symbol);
  }
}
