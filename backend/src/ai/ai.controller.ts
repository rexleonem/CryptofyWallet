import { Body, Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
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
