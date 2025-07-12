'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib';
import { Copy, ExternalLink, Loader2, LogOut, Wallet } from 'lucide-react';

import { useWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';

interface WalletConnectProps {
  lng: string;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ lng }) => {
  const { t } = useTranslation(lng);
  const {
    connected,
    loading,
    publicKey,
    balance,
    connectWallet,
    disconnectWallet,
  } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (!publicKey) return;

    try {
      await navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (connected && publicKey) {
    return (
      <div className='flex flex-col sm:flex-row items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center'>
            <Wallet className='w-4 h-4 text-white' />
          </div>
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-green-800 dark:text-green-200'>
              {t('trading.wallet-connected')}
            </span>
            <div className='flex items-center gap-2'>
              <span className='text-xs text-gray-600 dark:text-gray-400'>
                {truncateAddress(publicKey.toString())}
              </span>
              <Button
                size='sm'
                variant='ghost'
                onClick={copyAddress}
                className='h-auto p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              >
                {copied ? (
                  <span className='text-xs text-green-600'>Copied!</span>
                ) : (
                  <Copy className='w-3 h-3' />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <div className='text-right'>
            <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
              {balance.toFixed(4)} SOL
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {t('trading.balance')}
            </p>
          </div>

          <Button
            size='sm'
            variant='outline'
            onClick={disconnectWallet}
            className='flex items-center gap-2'
          >
            <LogOut className='w-4 h-4' />
            {t('trading.disconnect')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700'>
      <div className='flex items-center gap-3'>
        <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
          <Wallet className='w-6 h-6 text-white' />
        </div>
        <div className='text-center'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            {t('trading.connect-wallet')}
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            {t('trading.wallet-not-connected')}
          </p>
        </div>
      </div>

      <Button
        onClick={connectWallet}
        disabled={loading}
        className='w-full max-w-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none'
      >
        {loading ? (
          <>
            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className='w-4 h-4 mr-2' />
            {t('trading.connect-wallet')}
          </>
        )}
      </Button>

      <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
        <span>Powered by</span>
        <a
          href='https://phantom.app'
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-1 hover:text-purple-500 transition-colors'
        >
          Phantom
          <ExternalLink className='w-3 h-3' />
        </a>
      </div>
    </div>
  );
};
