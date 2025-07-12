import { supabase } from './supabase';
import type {
  ErrorEventData,
  EventData,
  QuoteRequestEventData,
  RevenueMetrics,
  SwapEventData,
  TradingMetrics,
  UserMetrics,
  WalletConnectEventData,
} from './types';

export class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async trackEvent(event: {
    event_type: string;
    user_id?: string;
    data: EventData;
    timestamp?: string;
  }): Promise<void> {
    try {
      const { error } = await supabase.from('analytics').insert({
        event_type: event.event_type,
        user_id: event.user_id,
        data: event.data,
        created_at: event.timestamp || new Date().toISOString(),
      });

      if (error) {
        console.error('Error tracking analytics event:', error);
      }
    } catch (error) {
      console.error('Error tracking analytics event:', error);
    }
  }

  async trackSwapEvent(
    userId: string,
    fromToken: string,
    toToken: string,
    fromAmount: number,
    toAmount: number,
    feeAmount: number,
    txHash: string
  ): Promise<void> {
    const eventData: SwapEventData = {
      from_token: fromToken,
      to_token: toToken,
      from_amount: fromAmount,
      to_amount: toAmount,
      fee_amount: feeAmount,
      tx_hash: txHash,
      timestamp: new Date().toISOString(),
    };

    await this.trackEvent({
      event_type: 'swap_executed',
      user_id: userId,
      data: eventData,
    });
  }

  async trackWalletConnect(
    userId: string,
    walletAddress: string
  ): Promise<void> {
    const eventData: WalletConnectEventData = {
      wallet_address: walletAddress,
      timestamp: new Date().toISOString(),
    };

    await this.trackEvent({
      event_type: 'wallet_connected',
      user_id: userId,
      data: eventData,
    });
  }

  async trackQuoteRequest(
    userId: string,
    fromToken: string,
    toToken: string,
    amount: number
  ): Promise<void> {
    const eventData: QuoteRequestEventData = {
      from_token: fromToken,
      to_token: toToken,
      amount: amount,
      timestamp: new Date().toISOString(),
    };

    await this.trackEvent({
      event_type: 'quote_requested',
      user_id: userId,
      data: eventData,
    });
  }

  async trackError(
    userId: string,
    errorType: string,
    errorMessage: string,
    context?: Record<string, unknown>
  ): Promise<void> {
    const eventData: ErrorEventData = {
      error_type: errorType,
      error_message: errorMessage,
      context: context,
      timestamp: new Date().toISOString(),
    };

    await this.trackEvent({
      event_type: 'error_occurred',
      user_id: userId,
      data: eventData,
    });
  }

  async getTradingMetrics(timeRange: string = '24h'): Promise<TradingMetrics> {
    try {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('created_at', this.getTimeRangeDate(timeRange));

      if (error) {
        throw error;
      }

      const totalVolume =
        transactions?.reduce(
          (sum: number, tx: { from_amount: number }) => sum + tx.from_amount,
          0
        ) || 0;
      const totalFees =
        transactions?.reduce(
          (sum: number, tx: { fee_amount: number }) => sum + tx.fee_amount,
          0
        ) || 0;
      const totalTransactions = transactions?.length || 0;
      const uniqueUsers = new Set(
        transactions?.map((tx: { user_id: string }) => tx.user_id) || []
      ).size;
      const averageTransactionSize =
        totalTransactions > 0 ? totalVolume / totalTransactions : 0;
      const conversionRate =
        totalTransactions > 0 ? (totalTransactions / uniqueUsers) * 100 : 0;

      return {
        total_volume: totalVolume,
        total_transactions: totalTransactions,
        total_fees: totalFees,
        average_transaction_size: averageTransactionSize,
        unique_users: uniqueUsers,
        conversion_rate: conversionRate,
      };
    } catch (error) {
      console.error('Error getting trading metrics:', error);
      throw new Error('Failed to get trading metrics');
    }
  }

  async getUserMetrics(userId: string): Promise<UserMetrics> {
    try {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      const totalVolume =
        transactions?.reduce(
          (sum: number, tx: { from_amount: number }) => sum + tx.from_amount,
          0
        ) || 0;
      const totalFees =
        transactions?.reduce(
          (sum: number, tx: { fee_amount: number }) => sum + tx.fee_amount,
          0
        ) || 0;
      const totalTransactions = transactions?.length || 0;
      const averageTransactionSize =
        totalTransactions > 0 ? totalVolume / totalTransactions : 0;

      return {
        total_volume: totalVolume,
        total_transactions: totalTransactions,
        total_fees: totalFees,
        average_transaction_size: averageTransactionSize,
        first_transaction: transactions?.[0]?.created_at,
        last_transaction: transactions?.[transactions.length - 1]?.created_at,
      };
    } catch (error) {
      console.error('Error getting user metrics:', error);
      throw new Error('Failed to get user metrics');
    }
  }

  async getRevenueMetrics(timeRange: string = '24h'): Promise<RevenueMetrics> {
    try {
      const { data: fees, error } = await supabase
        .from('fees')
        .select('*')
        .gte('created_at', this.getTimeRangeDate(timeRange));

      if (error) {
        throw error;
      }

      const totalFees =
        fees?.reduce(
          (sum: number, fee: { amount: number }) => sum + fee.amount,
          0
        ) || 0;
      const feesByToken =
        fees?.reduce(
          (
            acc: Record<string, number>,
            fee: { token: string; amount: number }
          ) => {
            acc[fee.token] = (acc[fee.token] || 0) + fee.amount;
            return acc;
          },
          {} as Record<string, number>
        ) || {};

      return {
        total_fees: totalFees,
        fees_by_token: feesByToken,
        total_transactions: fees?.length || 0,
      };
    } catch (error) {
      console.error('Error getting revenue metrics:', error);
      throw new Error('Failed to get revenue metrics');
    }
  }

  private getTimeRangeDate(timeRange: string): string {
    const now = new Date();
    switch (timeRange) {
      case '1h':
        return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    }
  }
}

export const analyticsService = AnalyticsService.getInstance();
