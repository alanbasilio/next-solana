// Mock implementation for Solana functionality
// This allows the app to build and run without actual Solana dependencies

export class PublicKey {
  private _bn: number;

  constructor(value: string | number) {
    this._bn = typeof value === 'string' ? parseInt(value, 16) : value;
  }

  toString(): string {
    return this._bn.toString(16);
  }

  toBase58(): string {
    return this.toString();
  }

  equals(other: PublicKey): boolean {
    return this._bn === other._bn;
  }
}

export class Connection {
  private endpoint: string;
  private commitment: string;

  constructor(endpoint: string, commitment: string = 'confirmed') {
    this.endpoint = endpoint;
    this.commitment = commitment;
  }

  async getBalance(_publicKey: PublicKey): Promise<number> {
    // Mock balance for demonstration
    return Math.floor(Math.random() * 10000000000); // Random balance in lamports
  }

  async getRecentBlockhash(): Promise<{ blockhash: string }> {
    return { blockhash: 'mock-blockhash' };
  }
}

export const clusterApiUrl = (network: string): string => {
  const endpoints: Record<string, string> = {
    'mainnet-beta': 'https://api.mainnet-beta.solana.com',
    devnet: 'https://api.devnet.solana.com',
    testnet: 'https://api.testnet.solana.com',
  };
  return endpoints[network] || endpoints['mainnet-beta'];
};

export const LAMPORTS_PER_SOL = 1000000000;
export const DEFAULT_COMMITMENT = 'confirmed';
export const TRANSACTION_TIMEOUT = 30000;
export const MAX_RETRIES = 3;
