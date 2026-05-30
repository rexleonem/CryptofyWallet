import { Body, Controller, ForbiddenException, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { OfferService } from './offer.service';
import { TradeService } from './trade.service';
import { OfferType, TradeStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('p2p')
@UseGuards(JwtAuthGuard)
export class P2pController {
  constructor(
    private readonly offerService: OfferService,
    private readonly tradeService: TradeService,
  ) {}

  @Post('offers')
  createOffer(@Body() data: any, @CurrentUser() user: any) {
    return this.offerService.createOffer({ ...data, userId: user.sub });
  }

  @Get('offers')
  getOffers(@Query('asset') asset?: string, @Query('type') type?: OfferType) {
    return this.offerService.findAll({ asset, type });
  }

  @Post('trades')
  initiateTrade(@Body() data: any, @CurrentUser() user: any) {
    return this.tradeService.initiateTrade({ ...data, buyerId: user.sub });
  }

  @Get('trades/:userId')
  getUserTrades(@Param('userId') userId: string, @CurrentUser() user: any) {
    if (userId !== user.sub && user.role !== 'ADMIN') {
      throw new ForbiddenException();
    }
    return this.tradeService.findUserTrades(userId);
  }

  @Post('trades/:id/status')
  updateTradeStatus(
    @Param('id') id: string,
    @Body('status') status: TradeStatus,
    @Body('txHash') txHash?: string,
  ) {
    return this.tradeService.updateStatus(id, status, txHash);
  }
}
