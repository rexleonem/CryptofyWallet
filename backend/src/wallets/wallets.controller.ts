import { Controller, Get, Param } from '@nestjs/common';
import { WalletsService } from './wallets.service';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('balance/:address')
  async getBalance(@Param('address') address: string) {
    return this.walletsService.getBalance(address);
  }
}
