import { Body, Controller, ForbiddenException, Get, Post, Param, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('transaction')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('gas-estimate')
  async getGasEstimate(@Body() body: { to: string, amount: string }) {
    return this.transactionService.getGasEstimate(body.to, body.amount);
  }

  @Post('withdrawals')
  async requestWithdrawal(
    @Body() body: { asset: string; network: string; to: string; amount: string; deviceId?: string; idempotencyKey: string; mfaCode: string },
    @CurrentUser() user: any,
  ) {
    return this.transactionService.requestWithdrawal({ ...body, userId: user.sub });
  }

  @Get('status/:hash')
  async getStatus(@Param('hash') hash: string) {
    return this.transactionService.getStatus(hash);
  }

  @Get('history/:address')
  async getHistory(@Param('address') address: string, @CurrentUser() user: any) {
    if (user.role !== 'ADMIN') {
      try {
        await this.transactionService.assertWalletOwnership(user.sub, address);
      } catch {
        throw new ForbiddenException();
      }
    }
    return this.transactionService.getHistory(address);
  }
}
