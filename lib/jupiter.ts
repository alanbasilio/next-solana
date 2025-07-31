import axios from 'axios';

import type {
  JupiterQuote,
  JupiterSwapRequest,
  JupiterSwapResponse,
  JupiterTokensResponse,
} from './types';

const JUPITER_API_URL =
  process.env.NEXT_PUBLIC_JUPITER_API_URL || 'https://quote-api.jup.ag/v6';

export class JupiterService {
  private static instance: JupiterService;
  private apiUrl: string;

  private constructor() {
    this.apiUrl = JUPITER_API_URL;
  }

  public static getInstance(): JupiterService {
    if (!JupiterService.instance) {
      JupiterService.instance = new JupiterService();
    }
    return JupiterService.instance;
  }

  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: string,
    slippageBps: number = 50,
    feeBps: number = 30
  ): Promise<JupiterQuote> {
    try {
      const response = await axios.get(`${this.apiUrl}/quote`, {
        params: {
          inputMint,
          outputMint,
          amount,
          slippageBps,
          feeBps,
          onlyDirectRoutes: false,
          asLegacyTransaction: false,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error getting Jupiter quote:', error);
      throw new Error('Failed to get quote from Jupiter');
    }
  }

  async getSwapTransaction(
    swapRequest: JupiterSwapRequest
  ): Promise<JupiterSwapResponse> {
    try {
      const response = await axios.post(`${this.apiUrl}/swap`, swapRequest, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error getting swap transaction:', error);
      throw new Error('Failed to get swap transaction from Jupiter');
    }
  }

  async getTokens(): Promise<JupiterTokensResponse> {
    try {
      const response = await axios.get(`${this.apiUrl}/tokens`);
      return response.data;
    } catch (error) {
      console.error('Error getting tokens:', error);
      throw new Error('Failed to get tokens from Jupiter');
    }
  }

  async getPrice(
    inputMint: string,
    outputMint: string,
    amount: string
  ): Promise<number> {
    try {
      const quote = await this.getQuote(inputMint, outputMint, amount);
      const inputAmount = parseFloat(quote.inAmount);
      const outputAmount = parseFloat(quote.outAmount);

      return outputAmount / inputAmount;
    } catch (error) {
      console.error('Error getting price:', error);
      throw new Error('Failed to get price from Jupiter');
    }
  }

  // Helper method to calculate platform fees
  calculatePlatformFee(amount: number, feePercentage: number = 0.3): number {
    return (amount * feePercentage) / 100;
  }

  // Helper method to calculate referral fees
  calculateReferralFee(amount: number, feePercentage: number = 0.1): number {
    return (amount * feePercentage) / 100;
  }
}

export const jupiterService = JupiterService.getInstance();
