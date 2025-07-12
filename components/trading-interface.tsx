'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib';
import {
  AlertCircle,
  ArrowUpDown,
  Loader2,
  Settings,
  TrendingUp,
} from 'lucide-react';

import { getTokenBySymbol, NATIVE_SOL, Token } from '@/lib/tokens';
import { useWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import { TokenSelector } from '@/components/token-selector';

interface TradingInterfaceProps {
  lng: string;
}

export const TradingInterface: React.FC<TradingInterfaceProps> = ({ lng }) => {
  const { t } = useTranslation(lng);
  const { connected, balance: solBalance } = useWallet();

  const [fromToken, setFromToken] = useState<Token | null>(NATIVE_SOL);
  const [toToken, setToToken] = useState<Token | null>(
    getTokenBySymbol('USDC') || null
  );
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [priceImpact, setPriceImpact] = useState<number | null>(null);

  // Simulated price calculation (in a real app, this would fetch from a DEX API)
  useEffect(() => {
    if (fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0) {
      // Simulate price calculation
      const mockPrice =
        fromToken.symbol === 'SOL'
          ? 100
          : fromToken.symbol === 'USDC'
            ? 1
            : fromToken.symbol === 'USDT'
              ? 1
              : 50;

      const toMockPrice =
        toToken.symbol === 'SOL'
          ? 100
          : toToken.symbol === 'USDC'
            ? 1
            : toToken.symbol === 'USDT'
              ? 1
              : 50;

      const estimatedAmount =
        (parseFloat(fromAmount) * mockPrice) / toMockPrice;
      setToAmount(estimatedAmount.toFixed(6));
      setEstimatedPrice(mockPrice / toMockPrice);
      setPriceImpact(0.1); // 0.1% price impact
    } else {
      setToAmount('');
      setEstimatedPrice(null);
      setPriceImpact(null);
    }
  }, [fromToken, toToken, fromAmount]);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;

    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleMaxClick = () => {
    if (fromToken?.symbol === 'SOL' && solBalance > 0) {
      // Reserve some SOL for transaction fees
      const maxAmount = Math.max(0, solBalance - 0.01);
      setFromAmount(maxAmount.toString());
    }
  };

  const handleSwap = async () => {
    if (!connected || !fromToken || !toToken || !fromAmount || isSwapping)
      return;

    setIsSwapping(true);

    try {
      // In a real implementation, you would:
      // 1. Get the best route from a DEX aggregator (like Jupiter)
      // 2. Create and sign the transaction
      // 3. Send the transaction to the network

      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success message
      alert(t('trading.transaction-confirmed'));

      // Reset form
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      console.error('Swap failed:', error);
      alert(t('trading.transaction-failed'));
    } finally {
      setIsSwapping(false);
    }
  };

  const canSwap =
    connected &&
    fromToken &&
    toToken &&
    fromAmount &&
    parseFloat(fromAmount) > 0;
  const insufficientBalance =
    fromToken?.symbol === 'SOL' && parseFloat(fromAmount) > solBalance;

  return (
    <div className='max-w-md mx-auto'>
      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
            <TrendingUp className='w-5 h-5 text-purple-500' />
            {t('trading.swap')}
          </h2>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => setShowSettings(!showSettings)}
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          >
            <Settings className='w-4 h-4' />
          </Button>
        </div>

        {showSettings && (
          <div className='mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                {t('trading.slippage')}
              </span>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                {slippage}%
              </span>
            </div>
            <div className='flex gap-2'>
              {[0.1, 0.5, 1.0].map(value => (
                <Button
                  key={value}
                  size='sm'
                  variant={slippage === value ? 'default' : 'outline'}
                  onClick={() => setSlippage(value)}
                  className='flex-1'
                >
                  {value}%
                </Button>
              ))}
            </div>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
              {t('trading.slippage-description')}
            </p>
          </div>
        )}

        <div className='space-y-4'>
          {/* From Token */}
          <div className='bg-gray-50 dark:bg-gray-900 rounded-lg p-4'>
            <div className='flex items-center justify-between mb-3'>
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                {t('trading.from')}
              </span>
              {fromToken?.symbol === 'SOL' && (
                <button
                  onClick={handleMaxClick}
                  className='text-xs text-purple-500 hover:text-purple-600 font-medium'
                >
                  {t('trading.balance')}: {solBalance.toFixed(4)} SOL
                </button>
              )}
            </div>
            <div className='flex gap-3'>
              <div className='flex-1'>
                <input
                  type='number'
                  value={fromAmount}
                  onChange={e => setFromAmount(e.target.value)}
                  placeholder='0.0'
                  className='w-full text-2xl font-semibold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400'
                  disabled={!connected}
                />
              </div>
              <div className='flex flex-col items-end'>
                <TokenSelector
                  selectedToken={fromToken}
                  onTokenSelect={setFromToken}
                  disabled={!connected}
                />
                {fromToken?.symbol === 'SOL' && (
                  <Button
                    size='sm'
                    variant='link'
                    onClick={handleMaxClick}
                    className='text-xs text-purple-500 hover:text-purple-600 p-0 h-auto'
                  >
                    {t('trading.max')}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className='flex justify-center'>
            <Button
              size='sm'
              variant='outline'
              onClick={handleSwapTokens}
              className='w-10 h-10 rounded-full border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              disabled={!connected}
            >
              <ArrowUpDown className='w-4 h-4' />
            </Button>
          </div>

          {/* To Token */}
          <div className='bg-gray-50 dark:bg-gray-900 rounded-lg p-4'>
            <div className='flex items-center justify-between mb-3'>
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                {t('trading.to')}
              </span>
              {estimatedPrice && (
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                  1 {fromToken?.symbol} ≈ {estimatedPrice.toFixed(6)}{' '}
                  {toToken?.symbol}
                </span>
              )}
            </div>
            <div className='flex gap-3'>
              <div className='flex-1'>
                <input
                  type='number'
                  value={toAmount}
                  placeholder='0.0'
                  readOnly
                  className='w-full text-2xl font-semibold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400'
                />
              </div>
              <TokenSelector
                selectedToken={toToken}
                onTokenSelect={setToToken}
                disabled={!connected}
              />
            </div>
          </div>

          {/* Transaction Details */}
          {estimatedPrice && priceImpact && (
            <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800'>
              <div className='flex items-center gap-2 mb-2'>
                <AlertCircle className='w-4 h-4 text-blue-500' />
                <span className='text-sm font-medium text-blue-800 dark:text-blue-200'>
                  {t('trading.swap-details')}
                </span>
              </div>
              <div className='space-y-1 text-sm'>
                <div className='flex justify-between text-gray-600 dark:text-gray-400'>
                  <span>{t('trading.price-impact')}</span>
                  <span className='text-green-600 dark:text-green-400'>
                    {priceImpact}%
                  </span>
                </div>
                <div className='flex justify-between text-gray-600 dark:text-gray-400'>
                  <span>{t('trading.minimum-received')}</span>
                  <span>
                    {(parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6)}{' '}
                    {toToken?.symbol}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={!canSwap || isSwapping || insufficientBalance}
            className='w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white border-none'
          >
            {isSwapping ? (
              <>
                <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                {t('trading.transaction-pending')}
              </>
            ) : insufficientBalance ? (
              t('trading.insufficient-balance')
            ) : !connected ? (
              t('trading.connect-wallet')
            ) : !canSwap ? (
              t('trading.swap-tokens')
            ) : (
              t('trading.swap-tokens')
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
