'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Activity, BarChart3, Coins, DollarSign, TrendingUp, Zap } from 'lucide-react'
import { useState } from 'react'
import { Analytics } from './analytics'
import { LiquidityPools } from './liquidity-pools'
import { Portfolio } from './portfolio'
import { TradingInterface } from './trading-interface'

const stats = [
  {
    title: 'Total Volume (24h)',
    value: '$2.4B',
    change: '+12.3%',
    icon: DollarSign,
    positive: true,
  },
  {
    title: 'Total Value Locked',
    value: '$890M',
    change: '+5.7%',
    icon: Coins,
    positive: true,
  },
  {
    title: 'Active Pools',
    value: '1,247',
    change: '+23',
    icon: Activity,
    positive: true,
  },
  {
    title: 'Fees Earned (24h)',
    value: '$125K',
    change: '+8.9%',
    icon: TrendingUp,
    positive: true,
  },
]

const topPairs = [
  { pair: 'SOL/USDC', volume: '$142M', change: '+5.2%', tvl: '$25M', apy: '12.4%' },
  { pair: 'ETH/USDC', volume: '$98M', change: '+3.1%', tvl: '$18M', apy: '8.7%' },
  { pair: 'BTC/USDC', volume: '$76M', change: '+2.8%', tvl: '$22M', apy: '6.3%' },
  { pair: 'RAY/SOL', volume: '$45M', change: '+12.5%', tvl: '$8M', apy: '18.9%' },
  { pair: 'ORCA/USDC', volume: '$32M', change: '+7.8%', tvl: '$6M', apy: '15.2%' },
]

export function DexMain() {
  const [activeTab, setActiveTab] = useState('trade')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Modern DEX on{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Solana</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Trade with concentrated liquidity, limit orders, and intelligent routing. Experience the fastest and most
              efficient DeFi trading on Solana.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Zap className="w-4 h-4 mr-2" />
                Concentrated Liquidity
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Limit Orders
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Jupiter Integration
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className={`text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>{stat.change}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Interface */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="trade">Trade</TabsTrigger>
                <TabsTrigger value="pools">Liquidity</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="trade">
                <TradingInterface />
              </TabsContent>
              <TabsContent value="pools">
                <LiquidityPools />
              </TabsContent>
              <TabsContent value="portfolio">
                <Portfolio />
              </TabsContent>
              <TabsContent value="analytics">
                <Analytics />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Top Trading Pairs */}
        <Card className="mt-8 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Trading Pairs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Pair</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Volume (24h)</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Change</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">TVL</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">APY</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {topPairs.map((pair, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    >
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900 dark:text-white">{pair.pair}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-900 dark:text-white">{pair.volume}</td>
                      <td className="py-4 px-4">
                        <span className="text-green-600 dark:text-green-400">{pair.change}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-900 dark:text-white">{pair.tvl}</td>
                      <td className="py-4 px-4">
                        <Badge variant="success">{pair.apy}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Button size="sm" variant="outline" onClick={() => setActiveTab('trade')}>
                          Trade
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
