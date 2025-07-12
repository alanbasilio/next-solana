'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib';
import { PieChart, TrendingDown, TrendingUp, Wallet } from 'lucide-react';

import { POPULAR_TOKENS, Token } from '@/lib/tokens';
import { useWallet } from '@/hooks/use-wallet';

interface TokenBalance {
  token: Token;
  balance: number;
  value: number;
  change24h: number;
}

interface PortfolioDisplayProps {
  lng: string;
}

export const PortfolioDisplay: React.FC<PortfolioDisplayProps> = ({ lng }) => {
  const { t } = useTranslation(lng);
  const { connected, balance: solBalance } = useWallet();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalChange24h, setTotalChange24h] = useState(0);

  useEffect(() => {
    if (connected) {
      // Simulate portfolio data (in a real app, this would fetch from blockchain)
      const mockBalances: TokenBalance[] = [
        {
          token: POPULAR_TOKENS[0], // SOL
          balance: solBalance,
          value: solBalance * 100, // Simulate SOL price at $100
          change24h: 2.5,
        },
        {
          token: POPULAR_TOKENS[1], // USDC
          balance: 1250.5,
          value: 1250.5,
          change24h: 0.1,
        },
        {
          token: POPULAR_TOKENS[2], // USDT
          balance: 750.25,
          value: 750.25,
          change24h: -0.05,
        },
        {
          token: POPULAR_TOKENS[3], // RAY
          balance: 45.75,
          value: 45.75 * 2.5, // Simulate RAY price at $2.5
          change24h: 5.2,
        },
      ];

      const total = mockBalances.reduce((sum, item) => sum + item.value, 0);
      const weightedChange = mockBalances.reduce(
        (sum, item) => sum + (item.change24h * item.value) / total,
        0
      );

      setBalances(mockBalances);
      setTotalValue(total);
      setTotalChange24h(weightedChange);
    }
  }, [connected, solBalance]);

  if (!connected) {
    return (
      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
            <Wallet className='w-4 h-4 text-white' />
          </div>
          <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
            {t('trading.portfolio')}
          </h2>
        </div>
        <p className='text-gray-500 dark:text-gray-400 text-center py-8'>
          {t('trading.wallet-not-connected')}
        </p>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
          <PieChart className='w-4 h-4 text-white' />
        </div>
        <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
          {t('trading.portfolio')}
        </h2>
      </div>

      <div className='mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-sm font-medium text-blue-800 dark:text-blue-200'>
            {t('trading.total-value')}
          </span>
          <div className='flex items-center gap-2'>
            {totalChange24h >= 0 ? (
              <TrendingUp className='w-4 h-4 text-green-500' />
            ) : (
              <TrendingDown className='w-4 h-4 text-red-500' />
            )}
            <span
              className={`text-sm font-medium ${
                totalChange24h >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {totalChange24h >= 0 ? '+' : ''}
              {totalChange24h.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
          ${totalValue.toFixed(2)}
        </div>
      </div>

      <div className='space-y-3'>
        {balances.map(item => (
          <div
            key={item.token.symbol}
            className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg'
          >
            <div className='flex items-center gap-3'>
              <div className='relative w-8 h-8'>
                <Image
                  src={item.token.logoURI || '/images/default-token.svg'}
                  alt={item.token.name}
                  fill
                  className='rounded-full'
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/default-token.svg';
                  }}
                />
              </div>
              <div className='flex flex-col'>
                <span className='font-medium text-gray-900 dark:text-gray-100'>
                  {item.token.symbol}
                </span>
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                  {item.balance.toFixed(
                    item.token.decimals >= 6 ? 6 : item.token.decimals
                  )}
                </span>
              </div>
            </div>

            <div className='flex flex-col items-end'>
              <span className='font-medium text-gray-900 dark:text-gray-100'>
                ${item.value.toFixed(2)}
              </span>
              <div className='flex items-center gap-1'>
                {item.change24h >= 0 ? (
                  <TrendingUp className='w-3 h-3 text-green-500' />
                ) : (
                  <TrendingDown className='w-3 h-3 text-red-500' />
                )}
                <span
                  className={`text-xs ${
                    item.change24h >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {item.change24h >= 0 ? '+' : ''}
                  {item.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-4 text-xs text-gray-500 dark:text-gray-400 text-center'>
        * {t('trading.24h-change')} based on simulated data
      </div>
    </div>
  );
};
