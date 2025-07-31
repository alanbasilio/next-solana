export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  mintAddress: string;
  coingeckoId?: string;
}

export const NATIVE_SOL: Token = {
  symbol: 'SOL',
  name: 'Solana',
  decimals: 9,
  mintAddress: '11111111111111111111111111111112', // System Program for native SOL
  coingeckoId: 'solana',
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
};

export const POPULAR_TOKENS: Token[] = [
  NATIVE_SOL,
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    coingeckoId: 'usd-coin',
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    mintAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    coingeckoId: 'tether',
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png',
  },
  {
    symbol: 'RAY',
    name: 'Raydium',
    decimals: 6,
    mintAddress: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    coingeckoId: 'raydium',
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png',
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    decimals: 5,
    mintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    coingeckoId: 'bonk',
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png',
  },
  {
    symbol: 'JUP',
    name: 'Jupiter',
    decimals: 6,
    mintAddress: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    coingeckoId: 'jupiter-exchange-solana',
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN/logo.png',
  },
];

export const TOKEN_MAP = new Map<string, Token>(
  POPULAR_TOKENS.map(token => [token.mintAddress, token])
);

export const getTokenByMint = (mintAddress: string): Token | undefined => {
  return TOKEN_MAP.get(mintAddress);
};

export const getTokenBySymbol = (symbol: string): Token | undefined => {
  return POPULAR_TOKENS.find(token => token.symbol === symbol);
};

export const isNativeSOL = (mintAddress: string): boolean => {
  return mintAddress === NATIVE_SOL.mintAddress;
};

export const formatTokenAmount = (amount: number, decimals: number): string => {
  return (amount / Math.pow(10, decimals)).toFixed(
    decimals >= 6 ? 6 : decimals
  );
};

export const parseTokenAmount = (amount: string, decimals: number): number => {
  return parseFloat(amount) * Math.pow(10, decimals);
};
