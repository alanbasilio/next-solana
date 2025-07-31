'use client';

import { useCallback, useEffect, useState } from 'react';
import { analyticsService, connection, supabase } from '@/lib';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

// Extend Window interface to include Solana
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: (options?: {
        onlyIfTrusted?: boolean;
      }) => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      on: (
        event: 'connect' | 'disconnect' | 'accountChanged',
        callback: (data?: PublicKey) => void
      ) => void;
      removeAllListeners: () => void;
    };
  }
}

export interface WalletState {
  connected: boolean;
  publicKey: string | null;
  balance: number;
  loading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  wallet_address: string;
  total_volume: number;
  total_fees_paid: number;
  referral_code: string;
  referred_by?: string;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    publicKey: null,
    balance: 0,
    loading: false,
    error: null,
  });

  const [user, setUser] = useState<User | null>(null);

  // Generate referral code
  const generateReferralCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Get user data from database
  const getUserData = useCallback(async (walletAddress: string) => {
    try {
      const { data: existingUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!existingUser) {
        // Create new user
        const referralCode = generateReferralCode();
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            wallet_address: walletAddress,
            referral_code: referralCode,
            total_volume: 0,
            total_fees_paid: 0,
          })
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        setUser(newUser);
      } else {
        setUser(existingUser);
      }
    } catch (error) {
      console.error('Error getting user data:', error);
    }
  }, []);

  // Check if Phantom wallet is available
  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      const { solana } = window;

      if (solana?.isPhantom) {
        const response = await solana.connect({ onlyIfTrusted: true });
        const publicKey = response.publicKey.toString();

        setWalletState(prev => ({
          ...prev,
          connected: true,
          publicKey,
          loading: false,
        }));

        // Get user data from database
        await getUserData(publicKey);

        // Track wallet connection
        await analyticsService.trackWalletConnect(
          user?.id || 'anonymous',
          publicKey
        );
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  }, [user?.id, getUserData]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      setWalletState(prev => ({ ...prev, loading: true, error: null }));

      const { solana } = window;

      if (!solana?.isPhantom) {
        throw new Error('Phantom wallet is not installed');
      }

      const response = await solana.connect();
      const publicKey = response.publicKey.toString();

      setWalletState(prev => ({
        ...prev,
        connected: true,
        publicKey,
        loading: false,
      }));

      // Get user data from database
      await getUserData(publicKey);

      // Track wallet connection
      await analyticsService.trackWalletConnect(
        user?.id || 'anonymous',
        publicKey
      );
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setWalletState(prev => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : 'Failed to connect wallet',
      }));
    }
  }, [user?.id, getUserData]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      const { solana } = window;

      if (solana) {
        await solana.disconnect();
      }

      setWalletState({
        connected: false,
        publicKey: null,
        balance: 0,
        loading: false,
        error: null,
      });

      setUser(null);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }, []);

  // Update user data
  const updateUserData = useCallback(
    async (updates: Partial<User>) => {
      if (!user?.id) return;

      try {
        const { data: updatedUser, error } = await supabase
          .from('users')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setUser(updatedUser);
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    },
    [user?.id]
  );

  // Get balance
  const getBalance = useCallback(async () => {
    if (!walletState.publicKey) return;

    try {
      const publicKey = new PublicKey(walletState.publicKey);
      const balance = await connection.getBalance(publicKey);

      setWalletState(prev => ({
        ...prev,
        balance: balance / LAMPORTS_PER_SOL,
      }));
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  }, [walletState.publicKey]);

  // Track transaction
  const trackTransaction = useCallback(
    async (
      fromToken: string,
      toToken: string,
      fromAmount: number,
      toAmount: number,
      feeAmount: number,
      txHash: string
    ) => {
      if (!user?.id) return;

      try {
        // Update user volume and fees
        await updateUserData({
          total_volume: user.total_volume + fromAmount,
          total_fees_paid: user.total_fees_paid + feeAmount,
        });

        // Track analytics
        await analyticsService.trackSwapEvent(
          user.id,
          fromToken,
          toToken,
          fromAmount,
          toAmount,
          feeAmount,
          txHash
        );
      } catch (error) {
        console.error('Error tracking transaction:', error);
      }
    },
    [user, updateUserData]
  );

  // Listen for wallet changes
  useEffect(() => {
    const { solana } = window;

    if (solana) {
      solana.on('connect', () => {
        console.log('Wallet connected');
      });

      solana.on('disconnect', () => {
        console.log('Wallet disconnected');
        setWalletState({
          connected: false,
          publicKey: null,
          balance: 0,
          loading: false,
          error: null,
        });
        setUser(null);
      });

      solana.on('accountChanged', (publicKey?: PublicKey) => {
        if (publicKey) {
          setWalletState(prev => ({
            ...prev,
            publicKey: publicKey.toString(),
          }));
          getUserData(publicKey.toString());
        } else {
          setWalletState({
            connected: false,
            publicKey: null,
            balance: 0,
            loading: false,
            error: null,
          });
          setUser(null);
        }
      });
    }

    return () => {
      if (solana) {
        solana.removeAllListeners();
      }
    };
  }, [getUserData]);

  // Check wallet connection on mount
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [checkIfWalletIsConnected]);

  // Update balance periodically
  useEffect(() => {
    if (walletState.connected) {
      getBalance();

      const interval = setInterval(getBalance, 10000); // Update every 10 seconds
      return () => clearInterval(interval);
    }
  }, [walletState.connected, getBalance]);

  return {
    ...walletState,
    user,
    connectWallet,
    disconnectWallet,
    updateUserData,
    trackTransaction,
  };
};
