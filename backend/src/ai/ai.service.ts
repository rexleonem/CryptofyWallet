import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PortfolioService } from '../portfolio/portfolio.service';
import axios from 'axios';

type AiAction =
  | { type: 'NAVIGATE'; label: string; screen: string; params?: Record<string, any> }
  | { type: 'ADD_ASSET'; label: string; symbol?: string }
  | { type: 'SEND'; label: string; params?: { symbol?: string; recipient?: string; amount?: string } }
  | { type: 'RECEIVE'; label: string };

@Injectable()
export class AiService {
  constructor(
    private portfolioService: PortfolioService,
    private configService: ConfigService
  ) {}

  private extractAddress(text: string): string | null {
    const m = text.match(/0x[a-fA-F0-9]{40}/);
    return m ? m[0] : null;
  }

  private extractAmount(text: string): string | null {
    const m = text.match(/(\d+(\.\d+)?)/);
    return m ? m[1] : null;
  }

  private extractSymbol(text: string): string | null {
    const m = text.match(/\b([A-Z]{2,6}|\$[A-Z]{3,10})\b/);
    return m ? m[1] : null;
  }

  private localActions(message: string): AiAction[] {
    const msg = message.trim().toLowerCase();
    const actions: AiAction[] = [];

    if (/\b(send|transfer|withdraw)\b/.test(msg)) {
      const recipient = this.extractAddress(message) || undefined;
      const amount = this.extractAmount(message) || undefined;
      const symbol = (this.extractSymbol(message) || undefined) as any;
      actions.push({ type: 'SEND', label: 'Send', params: { recipient, amount, symbol } });
    }
    if (/\b(receive|deposit|add funds)\b/.test(msg)) {
      actions.push({ type: 'RECEIVE', label: 'Receive' });
    }
    if (/\b(add|track)\b/.test(msg) && /\b(asset|coin|token|btc|eth|usd|wallets)\b/.test(msg)) {
      const symbol = this.extractSymbol(message) || undefined;
      actions.push({ type: 'ADD_ASSET', label: 'Add Asset', symbol });
    }
    if (/\b(wallet|wallets|portfolio|holdings)\b/.test(msg)) {
      actions.push({ type: 'NAVIGATE', label: 'Open Wallets', screen: 'Main', params: { tab: 'Wallets' } });
    }
    if (/\b(p2p)\b/.test(msg)) {
      actions.push({ type: 'NAVIGATE', label: 'Open P2P', screen: 'P2P' });
    }
    if (/\b(home|dashboard)\b/.test(msg)) {
      actions.push({ type: 'NAVIGATE', label: 'Open Home', screen: 'Main', params: { tab: 'Home' } });
    }

    // Always provide a couple of safe shortcuts.
    if (actions.length === 0) {
      actions.push({ type: 'NAVIGATE', label: 'Wallets', screen: 'Main', params: { tab: 'Wallets' } });
      actions.push({ type: 'RECEIVE', label: 'Receive' });
    }

    return actions.slice(0, 4);
  }

  async getPortfolioInsights(address: string) {
    const portfolio = await this.portfolioService.getSummary(address);
    
    const aiInput = {
      totalValue: Number(portfolio.totalValue) || 0,
      tokens: portfolio.tokens.map(t => ({
        symbol: t.symbol,
        value: t.value
      }))
    };

    try {
      const aiUrl =
        this.configService.get<string>('AI_ENGINE_URL') ||
        this.configService.get<string>('DEV_AI_ENGINE_URL') ||
        'http://localhost:8000';
        
      const response = await axios.post(`${aiUrl}/api/analyze/portfolio`, aiInput, { timeout: 12_000 });
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
      totalValue: Number(portfolio.totalValue) || 0,
      change24h: typeof portfolio.change24h === 'number' && Number.isFinite(portfolio.change24h) ? portfolio.change24h : 0,
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
      const aiUrl =
        this.configService.get<string>('AI_ENGINE_URL') ||
        this.configService.get<string>('DEV_AI_ENGINE_URL') ||
        'http://localhost:8000';

      const response = await axios.post(`${aiUrl}/api/chat/respond`, {
        message,
        context
      }, { timeout: 18_000 });
      const data = response.data || {};
      const actions = Array.isArray(data.actions) ? data.actions : [];
      return { ...data, actions: actions.length ? actions : this.localActions(message) };
    } catch (error) {
      console.error('AI Chat Error:', error.message);
      return {
        response: 'AI service unavailable',
        insights: [],
        actions: this.localActions(message)
      };
    }
  }
}
