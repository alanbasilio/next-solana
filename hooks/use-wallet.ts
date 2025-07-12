'use client';

import { useCallback, useEffect, useState } from 'react';

import { connection, LAMPORTS_PER_SOL } from '@/lib/solana';
import { PublicKey } from '@/lib/solana-mock';

// NOTE: This hook currently uses a mock Solana implementation
// For production use:
// 1. Replace import above with: import { PublicKey } from '@solana/web3.js';
// 2. Install proper Solana dependencies
// 3. Configure real RPC endpoints
// 4. The Phantom wallet integration will work with real blockchain

export interface WalletState {
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  balance: number;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    publicKey: null,
    connected: false,
    connecting: false,
    balance: 0,
  });

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      setWallet(prev => ({ ...prev, connecting: true }));

      // Check if Phantom wallet is available
      const { solana } = window as unknown as { solana: any };

      if (!solana || !solana.isPhantom) {
        alert('Phantom wallet not found! Please install Phantom wallet.');
        return;
      }

      // Connect to wallet
      const response = await solana.connect();
      const publicKey = new PublicKey(response.publicKey.toString());

      // Get balance
      const balance = await connection.getBalance(publicKey);

      setWallet({
        publicKey,
        connected: true,
        connecting: false,
        balance: balance / LAMPORTS_PER_SOL,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWallet(prev => ({ ...prev, connecting: false }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet({
      publicKey: null,
      connected: false,
      connecting: false,
      balance: 0,
    });
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!wallet.publicKey) return;

    try {
      const balance = await connection.getBalance(wallet.publicKey);
      setWallet(prev => ({ ...prev, balance: balance / LAMPORTS_PER_SOL }));
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  }, [wallet.publicKey]);

  useEffect(() => {
    // Auto-connect if previously connected
    const checkConnection = async () => {
      if (typeof window === 'undefined') return;

      try {
        const { solana } = window as unknown as { solana: any };
        if (solana && solana.isPhantom && solana.isConnected) {
          const publicKey = new PublicKey(solana.publicKey.toString());
          const balance = await connection.getBalance(publicKey);

          setWallet({
            publicKey,
            connected: true,
            connecting: false,
            balance: balance / LAMPORTS_PER_SOL,
          });
        }
      } catch (error) {
        console.error('Failed to check connection:', error);
      }
    };

    checkConnection();
  }, []);

  return {
    ...wallet,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  };
};
