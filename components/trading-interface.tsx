'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardContent, Input, TokenSelector } from '@/components';
import { useWallet } from '@/hooks';
import {
  getTokenBySymbol,
  jupiterService,
  NATIVE_SOL,
  Token,
  useTranslation,
  type JupiterQuote,
} from '@/lib';
import { ArrowUpDown, Info, Loader2, Settings, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface TradingInterfaceProps {
  lng: string;
}

export const TradingInterface: React.FC<TradingInterfaceProps> = ({ lng }) => {
  const { t } = useTranslation(lng);
  const {
    connected,
    balance: solBalance,
    user,
    trackTransaction,
  } = useWallet();

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
  const [platformFee, setPlatformFee] = useState<number>(0);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  // Get real-time quote from Jupiter
  useEffect(() => {
    const getQuote = async () => {
      if (
        !fromToken ||
        !toToken ||
        !fromAmount ||
        parseFloat(fromAmount) <= 0
      ) {
        setToAmount('');
        setEstimatedPrice(null);
        setPriceImpact(null);
        setPlatformFee(0);
        return;
      }

      setIsLoadingQuote(true);

      try {
        // Convert amount to proper format (considering decimals)
        const inputAmount =
          parseFloat(fromAmount) * Math.pow(10, fromToken.decimals);

        const quote = await jupiterService.getQuote(
          fromToken.mintAddress,
          toToken.mintAddress,
          inputAmount.toString(),
          slippage * 100, // Convert percentage to basis points
          30 // Platform fee in basis points (0.3%)
        );

        const outputAmount =
          parseFloat(quote.outAmount) / Math.pow(10, toToken.decimals);
        setToAmount(outputAmount.toFixed(6));

        // Calculate price
        const price = parseFloat(quote.outAmount) / parseFloat(quote.inAmount);
        setEstimatedPrice(price);

        // Calculate price impact
        setPriceImpact(quote.priceImpactPct);

        // Calculate platform fee
        const feeAmount = (parseFloat(fromAmount) * 0.3) / 100; // 0.3% fee
        setPlatformFee(feeAmount);

        // Track quote request
        if (user?.id) {
          // This would be implemented in analytics service
          console.log('Quote requested:', {
            fromToken,
            toToken,
            amount: fromAmount,
          });
        }
      } catch (error) {
        console.error('Error getting quote:', error);
        toast.error('Failed to get quote. Please try again.');
        setToAmount('');
        setEstimatedPrice(null);
        setPriceImpact(null);
        setPlatformFee(0);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    // Debounce quote requests
    const timeoutId = setTimeout(getQuote, 500);
    return () => clearTimeout(timeoutId);
  }, [fromToken, toToken, fromAmount, slippage, user?.id]);

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
    if (!connected || !fromToken || !toToken || !fromAmount || isSwapping) {
      toast.error('Please connect your wallet and enter an amount');
      return;
    }

    setIsSwapping(true);

    try {
      // Get quote for the swap
      const inputAmount =
        parseFloat(fromAmount) * Math.pow(10, fromToken.decimals);

      const quote = await jupiterService.getQuote(
        fromToken.mintAddress,
        toToken.mintAddress,
        inputAmount.toString(),
        slippage * 100,
        30 // Platform fee
      );

      // Get swap transaction
      const swapRequest = {
        quoteResponse: quote,
        userPublicKey: user?.wallet_address || '',
        wrapUnwrapSOL: fromToken.symbol === 'SOL' || toToken.symbol === 'SOL',
      };

      await jupiterService.getSwapTransaction(swapRequest);

      // Execute the transaction (this would be done by the wallet)
      // For now, we'll simulate the transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a mock transaction hash
      const txHash = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      // Track the transaction
      await trackTransaction(
        fromToken.symbol,
        toToken.symbol,
        parseFloat(fromAmount),
        parseFloat(toAmount),
        platformFee,
        txHash
      );

      // Save transaction to database
      await saveTransaction(txHash, quote);

      toast.success('Swap completed successfully!');

      // Reset form
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      console.error('Swap failed:', error);
      toast.error('Swap failed. Please try again.');
    } finally {
      setIsSwapping(false);
    }
  };

  const saveTransaction = async (txHash: string, quote: JupiterQuote) => {
    try {
      // This would save to Supabase
      console.log('Saving transaction:', {
        txHash,
        fromToken: fromToken?.symbol,
        toToken: toToken?.symbol,
        fromAmount: parseFloat(fromAmount),
        toAmount: parseFloat(toAmount),
        feeAmount: platformFee,
        quoteId: quote.quoteId,
      });
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const canSwap =
    connected &&
    fromToken &&
    toToken &&
    fromAmount &&
    parseFloat(fromAmount) > 0 &&
    !isLoadingQuote;

  const insufficientBalance =
    fromToken?.symbol === 'SOL' && parseFloat(fromAmount) > solBalance;

  return (
    <div className='max-w-md mx-auto'>
      <Card>
        <CardContent className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6'>
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
                  <Input
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
                  <Input
                    type='number'
                    value={toAmount}
                    placeholder={isLoadingQuote ? 'Loading...' : '0.0'}
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
            {estimatedPrice && priceImpact !== null && (
              <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800'>
                <div className='flex items-center gap-2 mb-2'>
                  <Info className='w-4 h-4 text-blue-500' />
                  <span className='text-sm font-medium text-blue-800 dark:text-blue-200'>
                    {t('trading.swap-details')}
                  </span>
                </div>
                <div className='space-y-1 text-sm'>
                  <div className='flex justify-between text-gray-600 dark:text-gray-400'>
                    <span>{t('trading.price-impact')}</span>
                    <span
                      className={`${
                        Math.abs(priceImpact) < 1
                          ? 'text-green-600 dark:text-green-400'
                          : Math.abs(priceImpact) < 3
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {priceImpact.toFixed(2)}%
                    </span>
                  </div>
                  <div className='flex justify-between text-gray-600 dark:text-gray-400'>
                    <span>{t('trading.minimum-received')}</span>
                    <span>
                      {(parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6)}{' '}
                      {toToken?.symbol}
                    </span>
                  </div>
                  <div className='flex justify-between text-gray-600 dark:text-gray-400'>
                    <span>Platform Fee</span>
                    <span className='text-purple-600 dark:text-purple-400'>
                      {platformFee.toFixed(6)} {fromToken?.symbol}
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
              ) : isLoadingQuote ? (
                <>
                  <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                  Getting Quote...
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
        </CardContent>
      </Card>
    </div>
  );
};
