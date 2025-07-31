import axios from 'axios';

import type { CoinGeckoToken, PriceData } from './types';

const COINGECKO_API_URL =
  process.env.NEXT_PUBLIC_COINGECKO_API_URL ||
  'https://api.coingecko.com/api/v3';

export class PricingService {
  private static instance: PricingService;
  private apiUrl: string;
  private cache: Map<string, { data: CoinGeckoToken; timestamp: number }> =
    new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  private constructor() {
    this.apiUrl = COINGECKO_API_URL;
  }

  public static getInstance(): PricingService {
    if (!PricingService.instance) {
      PricingService.instance = new PricingService();
    }
    return PricingService.instance;
  }

  async getTokenPrice(tokenId: string): Promise<CoinGeckoToken> {
    const cached = this.cache.get(tokenId);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${this.apiUrl}/simple/price`, {
        params: {
          ids: tokenId,
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_market_cap: true,
          include_24hr_vol: true,
          include_last_updated_at: true,
        },
      });

      const data = response.data[tokenId];
      const tokenPrice: CoinGeckoToken = {
        id: tokenId,
        symbol: tokenId.toUpperCase(),
        name: tokenId,
        current_price: data.usd,
        price_change_percentage_24h: data.usd_24h_change,
        market_cap: data.usd_market_cap,
        total_volume: data.usd_24h_vol,
        last_updated: new Date(data.last_updated_at * 1000).toISOString(),
      };

      this.cache.set(tokenId, { data: tokenPrice, timestamp: now });
      return tokenPrice;
    } catch (error) {
      console.error(`Error fetching price for ${tokenId}:`, error);
      throw new Error(`Failed to get price for ${tokenId}`);
    }
  }

  async getMultipleTokenPrices(tokenIds: string[]): Promise<PriceData> {
    const prices: PriceData = {};

    try {
      const response = await axios.get(`${this.apiUrl}/simple/price`, {
        params: {
          ids: tokenIds.join(','),
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_market_cap: true,
          include_24hr_vol: true,
          include_last_updated_at: true,
        },
      });

      for (const tokenId of tokenIds) {
        const data = response.data[tokenId];
        if (data) {
          prices[tokenId] = {
            id: tokenId,
            symbol: tokenId.toUpperCase(),
            name: tokenId,
            current_price: data.usd,
            price_change_percentage_24h: data.usd_24h_change,
            market_cap: data.usd_market_cap,
            total_volume: data.usd_24h_vol,
            last_updated: new Date(data.last_updated_at * 1000).toISOString(),
          };
        }
      }

      return prices;
    } catch (error) {
      console.error('Error fetching multiple token prices:', error);
      throw new Error('Failed to get multiple token prices');
    }
  }

  async getSolanaTokens(): Promise<CoinGeckoToken[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids: 'solana,usd-coin,tether,bonk,raydium,jupiter-exchange-solana',
          order: 'market_cap_desc',
          per_page: 50,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h',
        },
      });

      return response.data.map(
        (coin: {
          id: string;
          symbol: string;
          name: string;
          current_price: number;
          price_change_percentage_24h: number;
          market_cap: number;
          total_volume: number;
          last_updated: string;
        }) => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          current_price: coin.current_price,
          price_change_percentage_24h: coin.price_change_percentage_24h,
          market_cap: coin.market_cap,
          total_volume: coin.total_volume,
          last_updated: coin.last_updated,
        })
      );
    } catch (error) {
      console.error('Error fetching Solana tokens:', error);
      throw new Error('Failed to get Solana tokens');
    }
  }

  // Helper method to calculate price impact
  calculatePriceImpact(
    inputAmount: number,
    outputAmount: number,
    marketPrice: number
  ): number {
    const expectedOutput = inputAmount * marketPrice;
    const actualOutput = outputAmount;
    return ((actualOutput - expectedOutput) / expectedOutput) * 100;
  }

  // Helper method to format price
  formatPrice(price: number, decimals: number = 6): string {
    return price.toFixed(decimals);
  }

  // Helper method to format percentage
  formatPercentage(percentage: number): string {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  }
}

export const pricingService = PricingService.getInstance();
