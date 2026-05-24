import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PortfolioService } from '../portfolio/portfolio.service';
import axios from 'axios';

@Injectable()
export class AiService {
  constructor(
    private portfolioService: PortfolioService,
    private configService: ConfigService
  ) {}

  async getPortfolioInsights(address: string) {
    const portfolio = await this.portfolioService.getSummary(address);
    
    const aiInput = {
      totalValue: portfolio.totalValue,
      tokens: portfolio.tokens.map(t => ({
        symbol: t.symbol,
        value: t.value
      }))
    };

    try {
      const isProd = this.configService.get<string>('NODE_ENV') === 'production';
      const aiUrl = isProd 
        ? this.configService.get<string>('AI_ENGINE_URL') 
        : (this.configService.get<string>('DEV_AI_ENGINE_URL') || 'http://localhost:8000');
        
      const response = await axios.post(`${aiUrl}/api/analyze/portfolio`, aiInput);
      return response.data;
    } catch (error) {
      console.error('AI Insights Error:', error.message);
      return { message: 'AI service unavailable', insights: [] };
    }
  }

  async getChatResponse(address: string, message: string) {
    const portfolio = await this.portfolioService.getSummary(address);
    const insights = await this.getPortfolioInsights(address);

    const context = {
      totalValue: portfolio.totalValue,
      change24h: portfolio.change24h,
      riskLevel: insights.riskLevel ?? null,
      riskScore: insights.riskScore ?? null,
      topAsset: portfolio.tokens[0]?.symbol ?? null,
      tokens: portfolio.tokens.map(t => ({
        symbol: t.symbol,
        amount: t.amount,
        value: t.value
      }))
    };

    try {
      const isProd = this.configService.get<string>('NODE_ENV') === 'production';
      const aiUrl = isProd 
        ? this.configService.get<string>('AI_ENGINE_URL') 
        : (this.configService.get<string>('DEV_AI_ENGINE_URL') || 'http://localhost:8000');

      const response = await axios.post(`${aiUrl}/api/chat/respond`, {
        message,
        context
      });
      return response.data;
    } catch (error) {
      console.error('AI Chat Error:', error.message);
      return {
        response: 'AI service unavailable',
        insights: [],
        actions: []
      };
    }
  }
}
