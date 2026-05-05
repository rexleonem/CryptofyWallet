import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { OfferService } from './offer.service';
import { TradeService } from './trade.service';
import { OfferType, TradeStatus } from '@prisma/client';

@Controller('p2p')
export class P2pController {
  constructor(
    private readonly offerService: OfferService,
    private readonly tradeService: TradeService,
  ) {}

  @Post('offers')
  createOffer(@Body() data: any) {
    return this.offerService.createOffer(data);
  }

  @Get('offers')
  getOffers(@Query('asset') asset?: string, @Query('type') type?: OfferType) {
    return this.offerService.findAll({ asset, type });
  }

  @Post('trades')
  initiateTrade(@Body() data: any) {
    return this.tradeService.initiateTrade(data);
  }

  @Get('trades/:userId')
  getUserTrades(@Param('userId') userId: string) {
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
