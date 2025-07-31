import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';

export const SOLANA_NETWORK = 'devnet';

// RPC endpoints
export const RPC_ENDPOINTS = {
  'mainnet-beta': clusterApiUrl('mainnet-beta'),
  devnet: clusterApiUrl('devnet'),
  testnet: clusterApiUrl('testnet'),
  localnet: 'http://127.0.0.1:8899',
};

export const connection = new Connection(
  RPC_ENDPOINTS[SOLANA_NETWORK],
  'confirmed'
);

export const SYSTEM_PROGRAM_ID = new PublicKey(
  '11111111111111111111111111111112'
);

export const DEFAULT_COMMITMENT = 'confirmed';

export const TRANSACTION_TIMEOUT = 30000; // 30 seconds

export const MAX_RETRIES = 3;

export const LAMPORTS_PER_SOL = 1000000000;
