import { Injectable } from '@nestjs/common';
import { PortfolioService } from '../portfolio/portfolio.service';
import axios from 'axios';

@Injectable()
export class AiService {
  constructor(private portfolioService: PortfolioService) {}

  async getPortfolioInsights(address: string) {
    const portfolio = await this.portfolioService.getSummary(address);
    
    // Format data for Python AI service
    const aiInput = {
      totalValue: parseFloat(portfolio.totalValue),
      tokens: portfolio.tokens.map(t => ({
        symbol: t.symbol,
        value: parseFloat(t.value)
      }))
    };

    try {
      const aiUrl = process.env.AI_ENGINE_URL || 'http://localhost:8000';
      const response = await axios.post(`${aiUrl}/api/analyze/portfolio`, aiInput);
      return response.data;
    } catch (error) {
      console.error('AI Insights Error:', error.message);
      return { riskScore: 50, riskLevel: 'medium', insights: [] };
    }
  }

  async getChatResponse(address: string, message: string) {
    const portfolio = await this.portfolioService.getSummary(address);
    const insights = await this.getPortfolioInsights(address);

    // Mocking user plan lookup for Stage 7
    const userPlan = 'FREE'; 

    if (userPlan === 'FREE') {
      return {
        response: "You are currently on the FREE plan. Upgrade to PRO to get personalized strategy advice and deeper portfolio reasoning.",
        insights: [insights.insights?.[0] || 'Basic risk analysis available'],
        actions: ["Upgrade to PRO"]
      };
    }

    const context = {
      totalValue: parseFloat(portfolio.totalValue),
      change24h: portfolio.change24h,
      riskLevel: insights.riskLevel,
      riskScore: insights.riskScore,
      topAsset: portfolio.tokens[0]?.symbol || 'None',
      tokens: portfolio.tokens.map(t => ({
        symbol: t.symbol,
        amount: t.amount,
        value: parseFloat(t.value)
      }))
    };

    try {
      const aiUrl = process.env.AI_ENGINE_URL || 'http://localhost:8000';
      const response = await axios.post(`${aiUrl}/api/chat/respond`, {
        message,
        context
      });
      return response.data;
    } catch (error) {
      console.error('AI Chat Error:', error.message);
      return {
        response: "I'm having trouble connecting to my brain right now. Please try again in a moment.",
        insights: [],
        actions: []
      };
    }
  }
}
