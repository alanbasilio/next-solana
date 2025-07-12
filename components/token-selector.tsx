'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Search } from 'lucide-react';

import { POPULAR_TOKENS, Token } from '@/lib/tokens';
import { Button } from '@/components/ui/button';

interface TokenSelectorProps {
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  disabled?: boolean;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onTokenSelect,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTokens = POPULAR_TOKENS.filter(
    token =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className='relative'>
      <Button
        variant='outline'
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className='w-full justify-between h-16 px-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
      >
        <div className='flex items-center gap-3'>
          {selectedToken ? (
            <>
              <div className='relative w-8 h-8'>
                <Image
                  src={selectedToken.logoURI || '/images/default-token.svg'}
                  alt={selectedToken.name}
                  fill
                  className='rounded-full'
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/default-token.svg';
                  }}
                />
              </div>
              <div className='flex flex-col items-start'>
                <span className='font-medium text-gray-900 dark:text-gray-100'>
                  {selectedToken.symbol}
                </span>
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                  {selectedToken.name}
                </span>
              </div>
            </>
          ) : (
            <span className='text-gray-500 dark:text-gray-400'>
              Select Token
            </span>
          )}
        </div>
        <ChevronDown className='w-4 h-4 text-gray-500' />
      </Button>

      {isOpen && (
        <div className='absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden'>
          <div className='p-3 border-b border-gray-200 dark:border-gray-700'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='Search tokens...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
              />
            </div>
          </div>

          <div className='max-h-60 overflow-y-auto'>
            {filteredTokens.map(token => (
              <button
                key={token.mintAddress}
                onClick={() => handleTokenSelect(token)}
                className='w-full p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
              >
                <div className='relative w-8 h-8'>
                  <Image
                    src={token.logoURI || '/images/default-token.svg'}
                    alt={token.name}
                    fill
                    className='rounded-full'
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/default-token.svg';
                    }}
                  />
                </div>
                <div className='flex flex-col items-start'>
                  <span className='font-medium text-gray-900 dark:text-gray-100'>
                    {token.symbol}
                  </span>
                  <span className='text-xs text-gray-500 dark:text-gray-400'>
                    {token.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
