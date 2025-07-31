'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks';
import { analyticsService, type RevenueMetrics, type UserMetrics } from '@/lib';
import {
  Activity,
  BarChart3,
  DollarSign,
  PieChart,
  TrendingUp,
  Users,
} from 'lucide-react';

interface DashboardProps {
  lng: string;
}

interface Metrics {
  totalVolume: number;
  totalTransactions: number;
  totalFees: number;
  uniqueUsers: number;
  averageTransactionSize: number;
  conversionRate: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ lng: _lng }) => {
  const { user } = useWallet();

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    const loadMetrics = async () => {
      setLoading(true);
      try {
        const [tradingMetrics, revenue] = await Promise.all([
          analyticsService.getTradingMetrics(timeRange),
          analyticsService.getRevenueMetrics(timeRange),
        ]);

        setMetrics({
          totalVolume: tradingMetrics.total_volume,
          totalTransactions: tradingMetrics.total_transactions,
          totalFees: tradingMetrics.total_fees,
          uniqueUsers: tradingMetrics.unique_users,
          averageTransactionSize: tradingMetrics.average_transaction_size,
          conversionRate: tradingMetrics.conversion_rate,
        });

        setRevenueMetrics(revenue);

        if (user?.id) {
          const userData = await analyticsService.getUserMetrics(user.id);
          setUserMetrics(userData);
        }
      } catch (error) {
        console.error('Error loading metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [timeRange, user?.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Time Range Selector */}
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
          Trading Analytics
        </h2>
        <div className='flex gap-2'>
          {['1h', '24h', '7d', '30d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Platform Metrics */}
      {metrics && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  Total Volume
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                  {formatCurrency(metrics.totalVolume)}
                </p>
              </div>
              <div className='w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center'>
                <TrendingUp className='w-6 h-6 text-green-600 dark:text-green-400' />
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  Total Transactions
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                  {formatNumber(metrics.totalTransactions)}
                </p>
              </div>
              <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center'>
                <Activity className='w-6 h-6 text-blue-600 dark:text-blue-400' />
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  Platform Fees
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                  {formatCurrency(metrics.totalFees)}
                </p>
              </div>
              <div className='w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center'>
                <DollarSign className='w-6 h-6 text-purple-600 dark:text-purple-400' />
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  Unique Users
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                  {formatNumber(metrics.uniqueUsers)}
                </p>
              </div>
              <div className='w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center'>
                <Users className='w-6 h-6 text-orange-600 dark:text-orange-400' />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Metrics */}
      {userMetrics && (
        <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
            Your Trading Activity
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                Your Total Volume
              </p>
              <p className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                {formatCurrency(userMetrics.total_volume)}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                Your Total Fees Paid
              </p>
              <p className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                {formatCurrency(userMetrics.total_fees)}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                Your Transactions
              </p>
              <p className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                {formatNumber(userMetrics.total_transactions)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Breakdown */}
      {revenueMetrics && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2'>
              <BarChart3 className='w-5 h-5 text-purple-500' />
              Revenue Overview
            </h3>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  Total Revenue
                </span>
                <span className='font-semibold text-gray-900 dark:text-gray-100'>
                  {formatCurrency(revenueMetrics.total_fees)}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  Total Transactions
                </span>
                <span className='font-semibold text-gray-900 dark:text-gray-100'>
                  {formatNumber(revenueMetrics.total_transactions)}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  Average Fee per Transaction
                </span>
                <span className='font-semibold text-gray-900 dark:text-gray-100'>
                  {formatCurrency(
                    revenueMetrics.total_fees /
                      revenueMetrics.total_transactions
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2'>
              <PieChart className='w-5 h-5 text-purple-500' />
              Revenue by Token
            </h3>
            <div className='space-y-3'>
              {revenueMetrics.fees_by_token &&
                Object.entries(revenueMetrics.fees_by_token).map(
                  ([token, amount]) => (
                    <div
                      key={token}
                      className='flex justify-between items-center'
                    >
                      <span className='text-sm text-gray-600 dark:text-gray-400'>
                        {token}
                      </span>
                      <span className='font-semibold text-gray-900 dark:text-gray-100'>
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
      )}

      {/* Referral Program */}
      {user && (
        <div className='bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white'>
          <h3 className='text-lg font-semibold mb-4'>Referral Program</h3>
          <div className='space-y-4'>
            <div>
              <p className='text-sm opacity-90'>Your Referral Code</p>
              <p className='text-xl font-bold'>{user.referral_code}</p>
            </div>
            <div>
              <p className='text-sm opacity-90'>
                Earn 0.1% of trading volume from users who sign up with your
                code
              </p>
            </div>
            <button className='bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors'>
              Share Referral Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
