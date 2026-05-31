import { BadRequestException, Injectable } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { ethers } from 'ethers';
import { PORTFOLIO_CACHE_TTL, SUPPORTED_ASSETS, SUPPORTED_PORTFOLIO_CHAINS } from '../common/constants';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class PortfolioService {
  private cache = new Map<string, { data: any, timestamp: number }>();
  private CACHE_TTL = PORTFOLIO_CACHE_TTL;

  constructor(private blockchainService: BlockchainService, private prisma: PrismaService) {}

  async assertWalletOwnership(userId: string, address: string) {
    const wallet = await this.prisma.wallet.findFirst({ where: { userId, address } });
    if (!wallet) {
      throw new Error('Wallet not found for user');
    }
    return wallet;
  }

  async getSummary(address: string) {
    const cached = this.cache.get(address);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    const chains = SUPPORTED_PORTFOLIO_CHAINS;
    const allTokens: Array<any> = [];

    try {
      const portfolio = await this.prisma.portfolio.findFirst({ where: { walletId: address } });
      const portfolioAssets = Array.isArray((portfolio as any)?.assets) ? ((portfolio as any).assets as any[]) : [];

      for (const chain of chains) {
        const provider = this.blockchainService.getProvider(chain);
        const balanceWei = await provider.getBalance(address).catch(() => 0n);
        const balanceEth = parseFloat(ethers.formatEther(balanceWei));
        
        if (balanceEth > 0) {
          allTokens.push({
            symbol: chain === 'POLYGON' ? 'MATIC' : chain === 'BSC' ? 'BNB' : 'ETH',
            name: chain === 'POLYGON' ? 'Polygon' : chain === 'BSC' ? 'Binance' : 'Ethereum',
            amount: balanceEth.toFixed(4),
            value: null,
            change24h: null,
            price: null,
            chain
          });
        }
      }

      // Merge in user-added assets (positions) so the UI always reflects the user's portfolio composition.
      for (const asset of portfolioAssets) {
        if (!asset?.symbol) continue;
        const existing = allTokens.find((t) => String(t.symbol).toUpperCase() === String(asset.symbol).toUpperCase());
        const amount = String(asset.amount ?? '0');
        if (existing) {
          // If there is already a native token entry, we sum amounts (best-effort numeric).
          const next = (Number(existing.amount) || 0) + (Number(amount) || 0);
          existing.amount = Number.isFinite(next) ? next.toFixed(6) : existing.amount;
          existing.name = existing.name || asset.name;
        } else {
          allTokens.push({
            symbol: String(asset.symbol),
            name: String(asset.name || asset.symbol),
            amount,
            value: null,
            change24h: null,
            price: null,
            chain: asset.chain || 'CUSTODY',
            coingeckoId: asset.coingeckoId ?? null,
          });
        }
      }

      // Price lookup for assets with CoinGecko ids.
      const ids = Array.from(
        new Set(
          allTokens
            .map((t) => t.coingeckoId)
            .filter((id: any) => typeof id === 'string' && id.length > 0),
        ),
      );
      let prices: Record<string, { usd?: number; usd_24h_change?: number }> = {};
      if (ids.length > 0) {
        try {
          const res = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
              ids: ids.join(','),
              vs_currencies: 'usd',
              include_24hr_change: 'true',
            },
            timeout: 8000,
          });
          prices = res.data || {};
        } catch {
          prices = {};
        }
      }

      let total = 0;
      for (const t of allTokens) {
        const id = t.coingeckoId;
        const px = id ? prices?.[id]?.usd : undefined;
        const ch = id ? prices?.[id]?.usd_24h_change : undefined;
        if (typeof px === 'number' && Number.isFinite(px)) {
          t.price = String(px);
          t.change24h = typeof ch === 'number' && Number.isFinite(ch) ? ch : null;
          const amt = Number(t.amount);
          if (Number.isFinite(amt)) {
            const v = amt * px;
            t.value = String(v);
            total += v;
          }
        }
      }

      const result = {
        totalValue: Number.isFinite(total) && total > 0 ? String(total) : null,
        // We only expose per-asset 24h changes right now; aggregate can be added once we have snapshot history.
        change24h: null,
        tokens: allTokens,
      };

      this.cache.set(address, { data: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      return {
        totalValue: null,
        change24h: null,
        tokens: [],
      };
    }
  }

  async getHistory(address: string) {
    return [];
  }

  getSupportedAssets() {
    return SUPPORTED_ASSETS;
  }

  async listAssets(address: string) {
    const portfolio = await this.prisma.portfolio.findFirst({ where: { walletId: address } });
    const assets = Array.isArray((portfolio as any)?.assets) ? (portfolio as any).assets : [];
    return assets;
  }

  private async getOrCreatePortfolio(address: string) {
    const existing = await this.prisma.portfolio.findFirst({ where: { walletId: address } });
    if (existing) return existing;
    return this.prisma.portfolio.create({
      data: {
        name: 'Main Portfolio',
        walletId: address,
        assets: [],
      },
    });
  }

  async addAsset(address: string, input: { symbol: string; amount: string; name?: string; chain?: string; coingeckoId?: string | null }) {
    const symbol = String(input.symbol).trim().toUpperCase();
    if (!symbol) throw new BadRequestException('symbol is required');

    const amountStr = String(input.amount ?? '').trim();
    const amount = Number(amountStr);
    if (!Number.isFinite(amount) || amount < 0) {
      throw new BadRequestException('amount must be a non-negative number');
    }

    const portfolio = await this.getOrCreatePortfolio(address);
    const current = Array.isArray((portfolio as any).assets) ? ((portfolio as any).assets as any[]) : [];

    const supported = SUPPORTED_ASSETS.find((a) => a.symbol.toUpperCase() === symbol);
    const nextAsset = {
      symbol,
      name: input.name?.trim() || supported?.name || symbol,
      amount: amountStr,
      chain: input.chain || 'CUSTODY',
      coingeckoId: input.coingeckoId ?? supported?.coingeckoId ?? null,
    };

    const idx = current.findIndex((a) => String(a?.symbol).toUpperCase() === symbol);
    const next = [...current];
    if (idx >= 0) {
      next[idx] = { ...next[idx], ...nextAsset };
    } else {
      next.push(nextAsset);
    }

    await this.prisma.portfolio.update({ where: { id: portfolio.id }, data: { assets: next } });
    this.cache.delete(address);
    return { ok: true, assets: next };
  }

  async removeAsset(address: string, symbol: string) {
    const s = String(symbol).trim().toUpperCase();
    const portfolio = await this.prisma.portfolio.findFirst({ where: { walletId: address } });
    if (!portfolio) return { ok: true, assets: [] };
    const current = Array.isArray((portfolio as any).assets) ? ((portfolio as any).assets as any[]) : [];
    const next = current.filter((a) => String(a?.symbol).trim().toUpperCase() !== s);
    await this.prisma.portfolio.update({ where: { id: portfolio.id }, data: { assets: next } });
    this.cache.delete(address);
    return { ok: true, assets: next };
  }
}
