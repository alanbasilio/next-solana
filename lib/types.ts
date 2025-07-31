// Database Types
export interface User {
  id: string;
  wallet_address: string;
  email?: string;
  created_at: string;
  updated_at: string;
  total_volume: number;
  total_fees_paid: number;
  referral_code: string;
  referred_by?: string;
  is_active: boolean;
}

export interface Transaction {
  id: string;
  user_id: string;
  tx_hash: string;
  from_token: string;
  to_token: string;
  from_amount: number;
  to_amount: number;
  fee_amount: number;
  fee_token: string;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
  confirmed_at?: string;
  jupiter_quote_id?: string;
  price_impact: number;
  slippage: number;
  network_fee?: number;
  route_plan?: RoutePlan[];
}

export interface Fee {
  id: string;
  transaction_id: string;
  amount: number;
  token: string;
  fee_type: 'platform' | 'referral' | 'network';
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  user_id?: string;
  data: Record<string, unknown>;
  created_at: string;
}

export interface ReferralReward {
  id: string;
  referrer_id: string;
  referred_id: string;
  transaction_id: string;
  reward_amount: number;
  reward_token: string;
  status: 'pending' | 'paid' | 'failed';
  created_at: string;
  paid_at?: string;
}

export interface TokenPrice {
  id: string;
  token_symbol: string;
  token_address: string;
  price_usd: number;
  price_change_24h?: number;
  market_cap?: number;
  volume_24h?: number;
  last_updated: string;
}

// Jupiter Types
export interface JupiterQuote {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee?: {
    feeBps: number;
    feeAccounts: Record<string, string>;
  };
  priceImpactPct: number;
  routePlan: RoutePlan[];
  contextSlot: number;
  timeTaken: number;
  quoteId?: string;
}

export interface RoutePlan {
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  percent: number;
}

export interface JupiterSwapRequest {
  quoteResponse: JupiterQuote;
  userPublicKey: string;
  wrapUnwrapSOL?: boolean;
  computeUnitPriceMicroLamports?: number;
  prioritizationFeeLamports?: number;
  asLegacyTransaction?: boolean;
}

export interface JupiterSwapResponse {
  swapTransaction: string;
}

// Pricing Types
export interface CoinGeckoToken {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  last_updated: string;
}

export interface PriceData {
  [tokenId: string]: CoinGeckoToken;
}

// Analytics Types
export interface TradingMetrics {
  total_volume: number;
  total_transactions: number;
  total_fees: number;
  unique_users: number;
  average_transaction_size: number;
  conversion_rate: number;
}

export interface UserMetrics {
  total_volume: number;
  total_transactions: number;
  total_fees: number;
  average_transaction_size: number;
  first_transaction?: string;
  last_transaction?: string;
}

export interface RevenueMetrics {
  total_fees: number;
  fees_by_token: Record<string, number>;
  total_transactions: number;
}

// Component Props Types
export interface DashboardProps {
  lng: string;
}

export interface TradingInterfaceProps {
  lng: string;
}

export interface WalletState {
  connected: boolean;
  publicKey: string | null;
  balance: number;
  loading: boolean;
  error: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

export interface JupiterTokensResponse {
  tokens: Array<{
    address: string;
    chainId: number;
    decimals: number;
    name: string;
    symbol: string;
    logoURI?: string;
    tags?: string[];
  }>;
}

// Event Types
export interface SwapEventData {
  from_token: string;
  to_token: string;
  from_amount: number;
  to_amount: number;
  fee_amount: number;
  tx_hash: string;
  timestamp: string;
}

export interface WalletConnectEventData {
  wallet_address: string;
  timestamp: string;
}

export interface QuoteRequestEventData {
  from_token: string;
  to_token: string;
  amount: number;
  timestamp: string;
}

export interface ErrorEventData {
  error_type: string;
  error_message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

// Generic Event Data
export type EventData =
  | SwapEventData
  | WalletConnectEventData
  | QuoteRequestEventData
  | ErrorEventData
  | Record<string, unknown>;
