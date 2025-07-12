import { createClient } from '@supabase/supabase-js';

import type {
  AnalyticsEvent,
  Fee,
  ReferralReward,
  TokenPrice,
  Transaction,
  User,
} from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (will be generated from Supabase)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: Transaction;
        Insert: Omit<Transaction, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Transaction, 'id' | 'created_at'>> & {
          id?: string;
          created_at?: string;
        };
      };
      fees: {
        Row: Fee;
        Insert: Omit<Fee, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Fee, 'id' | 'created_at'>> & {
          id?: string;
          created_at?: string;
        };
      };
      analytics: {
        Row: AnalyticsEvent;
        Insert: Omit<AnalyticsEvent, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<AnalyticsEvent, 'id' | 'created_at'>> & {
          id?: string;
          created_at?: string;
        };
      };
      referral_rewards: {
        Row: ReferralReward;
        Insert: Omit<ReferralReward, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<ReferralReward, 'id' | 'created_at'>> & {
          id?: string;
          created_at?: string;
        };
      };
      token_prices: {
        Row: TokenPrice;
        Insert: Omit<TokenPrice, 'id' | 'last_updated'> & {
          id?: string;
          last_updated?: string;
        };
        Update: Partial<Omit<TokenPrice, 'id' | 'last_updated'>> & {
          id?: string;
          last_updated?: string;
        };
      };
    };
  };
}
