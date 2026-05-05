import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { TradeService } from './trade.service';
import { EscrowService } from './escrow.service';
import { P2pController } from './p2p.controller';

@Module({
  controllers: [P2pController],
  providers: [OfferService, TradeService, EscrowService],
})
export class P2pModule {}
