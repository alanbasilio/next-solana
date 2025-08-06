'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowUpDown, BarChart3, Calendar, Settings, Target, Zap } from 'lucide-react'
import { useState } from 'react'
import { OrderBook } from './order-book'
import { RecentTrades } from './recent-trades'
import { TradingChart } from './trading-chart'

export function TradingInterface() {
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'dca'>('market')
  const [tradeDirection, setTradeDirection] = useState<'buy' | 'sell'>('buy')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [limitPrice, setLimitPrice] = useState('')
  const [slippage, setSlippage] = useState('0.5')

  const mockTokens = [
    { symbol: 'SOL', name: 'Solana', price: 98.42, change: '+5.2%', icon: '◎' },
    { symbol: 'USDC', name: 'USD Coin', price: 1.0, change: '+0.0%', icon: '$' },
    { symbol: 'ETH', name: 'Ethereum', price: 2847.32, change: '+3.1%', icon: 'Ξ' },
    { symbol: 'BTC', name: 'Bitcoin', price: 43250.89, change: '+2.8%', icon: '₿' },
  ]

  const [fromToken, setFromToken] = useState(mockTokens[0])
  const [toToken, setToToken] = useState(mockTokens[1])

  const handleSwapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Trading Form */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="w-5 h-5" />
                Swap
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            <Tabs
              value={orderType}
              onValueChange={(value: string) => setOrderType(value as 'market' | 'limit' | 'dca')}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="market" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Market
                </TabsTrigger>
                <TabsTrigger value="limit" className="text-xs">
                  <Target className="w-3 h-3 mr-1" />
                  Limit
                </TabsTrigger>
                <TabsTrigger value="dca" className="text-xs">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  DCA
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* From Token */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">From</Label>
              <div className="relative">
                <div className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <span className="text-lg">{fromToken.icon}</span>
                    <div className="min-w-0">
                      <div className="font-semibold">{fromToken.symbol}</div>
                      <div className="text-xs text-gray-500">{fromToken.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="text-right border-0 bg-transparent p-0 text-lg font-semibold"
                    />
                    <div className="text-xs text-gray-500">
                      ≈ ${(parseFloat(fromAmount || '0') * fromToken.price).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1 px-3">Balance: 12.45 {fromToken.symbol}</div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSwapTokens}
                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>

            {/* To Token */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">To</Label>
              <div className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <span className="text-lg">{toToken.icon}</span>
                  <div className="min-w-0">
                    <div className="font-semibold">{toToken.symbol}</div>
                    <div className="text-xs text-gray-500">{toToken.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={toAmount}
                    onChange={(e) => setToAmount(e.target.value)}
                    className="text-right border-0 bg-transparent p-0 text-lg font-semibold"
                  />
                  <div className="text-xs text-gray-500">
                    ≈ ${(parseFloat(toAmount || '0') * toToken.price).toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 px-3">Balance: 245.67 {toToken.symbol}</div>
            </div>

            {/* Limit Price (only for limit orders) */}
            {orderType === 'limit' && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Limit Price</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                />
                <div className="text-xs text-gray-500">
                  Current price: {(fromToken.price / toToken.price).toFixed(6)} {toToken.symbol}/{fromToken.symbol}
                </div>
              </div>
            )}

            {/* DCA Settings */}
            {orderType === 'dca' && (
              <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                  <Calendar className="w-4 h-4" />
                  Dollar Cost Averaging
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Frequency</Label>
                    <select className="w-full p-2 border rounded text-sm">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Duration</Label>
                    <select className="w-full p-2 border rounded text-sm">
                      <option>1 month</option>
                      <option>3 months</option>
                      <option>6 months</option>
                      <option>1 year</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Slippage & Settings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Slippage Tolerance</Label>
                <div className="flex space-x-1">
                  {['0.1', '0.5', '1.0'].map((value) => (
                    <Button
                      key={value}
                      variant={slippage === value ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs px-2 py-1"
                      onClick={() => setSlippage(value)}
                    >
                      {value}%
                    </Button>
                  ))}
                </div>
              </div>
              <Input
                type="number"
                placeholder="Custom %"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="text-sm"
              />
            </div>

            {/* Trade Info */}
            <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Price Impact</span>
                <span className="text-green-600">0.02%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Minimum Received</span>
                <span>
                  {(parseFloat(toAmount || '0') * 0.995).toFixed(6)} {toToken.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Fee</span>
                <span>0.3%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Route</span>
                <span className="text-right">
                  <Badge variant="secondary" className="text-xs">
                    Jupiter
                  </Badge>
                </span>
              </div>
            </div>

            {/* Action Button */}
            <Button
              className={`w-full ${tradeDirection === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              size="lg"
            >
              {orderType === 'market' ? 'Swap' : orderType === 'limit' ? 'Place Limit Order' : 'Setup DCA'}
            </Button>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {['25%', '50%', '75%', 'MAX'].map((percentage) => (
                <Button
                  key={percentage}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const balance = 12.45 // Mock balance
                    const amount = percentage === 'MAX' ? balance : balance * (parseInt(percentage) / 100)
                    setFromAmount(amount.toString())
                  }}
                >
                  {percentage}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Market Data */}
      <div className="lg:col-span-2 space-y-6">
        <TradingChart />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OrderBook />
          <RecentTrades />
        </div>
      </div>
    </div>
  )
}
