import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { WalletsService } from './wallets.service';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('balance/:address')
  async getBalance(@Param('address') address: string) {
    return this.walletsService.getBalance(address);
  }
  
  @Post('create')
  async createWallet(@Body() body: { userId: string, label?: string, network?: string }) {
    return this.walletsService.createWallet(body.userId, body.label, body.network);
  }

  @Get('user/:userId')
  async getUserWallets(@Param('userId') userId: string) {
    return this.walletsService.findByUserId(userId);
  }

  @Get('profile/:userId')
  async getAccountProfile(@Param('userId') userId: string) {
    return this.walletsService.getAccountProfile(userId);
  }
}
