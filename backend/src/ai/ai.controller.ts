import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('portfolio/:address')
  async getInsights(@Param('address') address: string) {
    return this.aiService.getPortfolioInsights(address);
  }

  @Post('chat')
  async chat(@Body() body: { address: string, message: string }) {
    return this.aiService.getChatResponse(body.address, body.message);
  }
}
