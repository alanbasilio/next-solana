'use client';

import { useParams } from 'next/navigation';
import {
  ConditionalLiquidityPanel,
  LanguageSwitcher,
  PortfolioDisplay,
  ThemeSwitcher,
  TradingInterface,
  WalletConnect,
} from '@/components';
import { useTranslation } from '@/lib';
import { Globe, Sparkles, TrendingUp } from 'lucide-react';

export default function Home() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng);

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <header className='flex items-center justify-between mb-12'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
              <Sparkles className='w-6 h-6 text-white' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                {t('trading.title')}
              </h1>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {t('trading.subtitle')}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </header>

        {/* Main Content */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Portfolio */}
          <div className='lg:col-span-1'>
            <PortfolioDisplay lng={lng} />
          </div>

          {/* Center Column - Trading Interface */}
          <div className='lg:col-span-1'>
            <div className='space-y-6'>
              <WalletConnect lng={lng} />
              <TradingInterface lng={lng} />
            </div>
          </div>

          {/* Right Column - Market Info */}
          <div className='lg:col-span-1'>
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center'>
                  <TrendingUp className='w-4 h-4 text-white' />
                </div>
                <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                  Market Overview
                </h2>
              </div>

              <div className='space-y-4'>
                <div className='p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-green-800 dark:text-green-200'>
                      {t('trading.sol')} Price
                    </span>
                    <span className='text-lg font-bold text-green-600 dark:text-green-400'>
                      $100.00
                    </span>
                  </div>
                  <div className='text-xs text-green-600 dark:text-green-400 mt-1'>
                    +2.5% (24h)
                  </div>
                </div>

                <div className='p-4 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      {t('trading.usdc')} Price
                    </span>
                    <span className='text-lg font-bold text-gray-900 dark:text-gray-100'>
                      $1.00
                    </span>
                  </div>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    +0.1% (24h)
                  </div>
                </div>

                <div className='p-4 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Network Fee
                    </span>
                    <span className='text-lg font-bold text-gray-900 dark:text-gray-100'>
                      0.000005 SOL
                    </span>
                  </div>
                  <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    ~$0.0005
                  </div>
                </div>
              </div>

              <div className='mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
                <div className='flex items-center gap-2 mb-2'>
                  <Globe className='w-4 h-4 text-blue-500' />
                  <span className='text-sm font-medium text-blue-800 dark:text-blue-200'>
                    Network Status
                  </span>
                </div>
                <div className='text-xs text-blue-600 dark:text-blue-400'>
                  Solana Mainnet - Active
                </div>
                <div className='text-xs text-blue-600 dark:text-blue-400 mt-1'>
                  TPS: 3,000+ transactions/second
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conditional Liquidity Section */}
        <div className='mt-12'>
          <ConditionalLiquidityPanel />
        </div>

        {/* Footer */}
        <footer className='mt-16 text-center'>
          <div className='flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400'>
            <a
              href='https://solana.com'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-purple-500 transition-colors'
            >
              Powered by Solana
            </a>
            <span>•</span>
            <a
              href='https://phantom.app'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-purple-500 transition-colors'
            >
              Phantom Wallet
            </a>
            <span>•</span>
            <span>Built with Next.js</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
