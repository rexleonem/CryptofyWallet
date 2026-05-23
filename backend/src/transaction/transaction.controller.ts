import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('gas-estimate')
  async getGasEstimate(@Body() body: { to: string, amount: string }) {
    return this.transactionService.getGasEstimate(body.to, body.amount);
  }

  @Post('withdrawals')
  async requestWithdrawal(
    @Body() body: { userId: string; asset: string; network: string; to: string; amount: string; deviceId?: string },
  ) {
    return this.transactionService.requestWithdrawal(body);
  }

  @Get('status/:hash')
  async getStatus(@Param('hash') hash: string) {
    return this.transactionService.getStatus(hash);
  }

  @Get('history/:address')
  async getHistory(@Param('address') address: string) {
    return this.transactionService.getHistory(address);
  }
}
