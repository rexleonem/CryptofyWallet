import { Body, Controller, ForbiddenException, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('balance/:address')
  async getBalance(@Param('address') address: string) {
    return this.walletsService.getBalance(address);
  }
  
  @Post('create')
  async createWallet(@Body() body: { label?: string, network?: string }, @CurrentUser() user: any) {
    return this.walletsService.createWallet(user.sub, body.label, body.network);
  }

  @Get('user/:userId')
  async getUserWallets(@Param('userId') userId: string, @CurrentUser() user: any) {
    if (userId !== user.sub && user.role !== 'ADMIN') {
      throw new ForbiddenException();
    }
    return this.walletsService.findByUserId(userId);
  }

  @Get('profile/:userId')
  async getAccountProfile(@Param('userId') userId: string, @CurrentUser() user: any) {
    if (userId !== user.sub && user.role !== 'ADMIN') {
      throw new ForbiddenException();
    }
    return this.walletsService.getAccountProfile(userId);
  }
}
