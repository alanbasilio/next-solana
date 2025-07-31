'use client';

import { useCallback, useState } from 'react';
import {
  conditionalLiquidityManager,
  type DeclarativeSwap,
  type ToxicityMetrics,
} from '@/lib';

export interface UseConditionalLiquidityReturn {
  // State
  activeSwaps: DeclarativeSwap[];
  toxicityMetrics: ToxicityMetrics | null;

  // Actions
  createDeclarativeSwap: (
    fromToken: string,
    toToken: string,
    amount: number,
    maxSlippage: number,
    intent: DeclarativeSwap['intent'],
    priority?: DeclarativeSwap['priority']
  ) => DeclarativeSwap;

  executeDeclarativeSwap: (
    swapId: string,
    walletAddress: string
  ) => Promise<{ success: boolean; txHash?: string; error?: string }>;

  getToxicityMetrics: (walletAddress: string) => ToxicityMetrics | null;
  getOptimalSpread: (
    walletAddress: string,
    baseSpread: number,
    tradeSize: number
  ) => number;

  // UI helpers
  getSegmentInfo: (toxicityScore: number) => {
    segment: string;
    spread: number;
    description: string;
  };
}

export const useConditionalLiquidity = (): UseConditionalLiquidityReturn => {
  const [activeSwaps, setActiveSwaps] = useState<DeclarativeSwap[]>([]);
  const [toxicityMetrics, setToxicityMetrics] =
    useState<ToxicityMetrics | null>(null);

  // Create a new declarative swap
  const createDeclarativeSwap = useCallback(
    (
      fromToken: string,
      toToken: string,
      amount: number,
      maxSlippage: number,
      intent: DeclarativeSwap['intent'],
      priority: DeclarativeSwap['priority'] = 'medium'
    ): DeclarativeSwap => {
      const swap = conditionalLiquidityManager.createDeclarativeSwap(
        fromToken,
        toToken,
        amount,
        maxSlippage,
        intent,
        priority
      );

      setActiveSwaps(prev => [...prev, swap]);
      return swap;
    },
    []
  );

  // Execute a declarative swap
  const executeDeclarativeSwap = useCallback(
    async (
      swapId: string,
      walletAddress: string
    ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
      const result = await conditionalLiquidityManager.executeDeclarativeSwap(
        swapId,
        walletAddress
      );

      if (result.success) {
        // Remove from active swaps
        setActiveSwaps(prev => prev.filter(swap => swap.id !== swapId));

        // Update toxicity metrics
        const metrics =
          conditionalLiquidityManager.getToxicityMetrics(walletAddress);
        setToxicityMetrics(metrics);
      }

      return result;
    },
    []
  );

  // Get toxicity metrics for a wallet
  const getToxicityMetrics = useCallback(
    (walletAddress: string): ToxicityMetrics | null => {
      return conditionalLiquidityManager.getToxicityMetrics(walletAddress);
    },
    []
  );

  // Get optimal spread for a trader
  const getOptimalSpread = useCallback(
    (walletAddress: string, baseSpread: number, tradeSize: number): number => {
      return conditionalLiquidityManager.getOptimalSpread(
        walletAddress,
        baseSpread,
        tradeSize
      );
    },
    []
  );

  // Get segment information for UI display
  const getSegmentInfo = useCallback((toxicityScore: number) => {
    if (toxicityScore <= 0.1) {
      return {
        segment: 'Institutional',
        spread: 0.001, // 0.1%
        description: 'Low toxicity, institutional trader',
      };
    } else if (toxicityScore <= 0.3) {
      return {
        segment: 'Retail',
        spread: 0.002, // 0.2%
        description: 'Normal retail trader',
      };
    } else {
      return {
        segment: 'Arbitrage',
        spread: 0.005, // 0.5%
        description: 'High toxicity, potential arbitrage',
      };
    }
  }, []);

  return {
    activeSwaps,
    toxicityMetrics,
    createDeclarativeSwap,
    executeDeclarativeSwap,
    getToxicityMetrics,
    getOptimalSpread,
    getSegmentInfo,
  };
};
