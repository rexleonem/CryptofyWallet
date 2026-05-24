import { Injectable, ServiceUnavailableException } from '@nestjs/common';

@Injectable()
export class EscrowService {
  async lockEscrow(tradeId: string, amount: number, sellerAddress: string): Promise<string> {
    throw new ServiceUnavailableException('Escrow execution unavailable');
  }

  async releaseEscrow(tradeId: string, buyerAddress: string): Promise<string> {
    throw new ServiceUnavailableException('Escrow execution unavailable');
  }

  async refundEscrow(tradeId: string, sellerAddress: string): Promise<string> {
    throw new ServiceUnavailableException('Escrow execution unavailable');
  }
}
