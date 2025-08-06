'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, TrendingUp } from 'lucide-react'

export function OrderBook() {
  // Mock order book data
  const bids = [
    { price: 98.4, amount: 1250.5, total: 123047.2 },
    { price: 98.35, amount: 890.2, total: 87554.47 },
    { price: 98.3, amount: 2340.8, total: 230201.04 },
    { price: 98.25, amount: 450.3, total: 44242.03 },
    { price: 98.2, amount: 1580.7, total: 155226.74 },
    { price: 98.15, amount: 720.4, total: 70717.06 },
    { price: 98.1, amount: 930.8, total: 91233.48 },
    { price: 98.05, amount: 1120.3, total: 109847.42 },
  ]

  const asks = [
    { price: 98.45, amount: 840.2, total: 82750.89 },
    { price: 98.5, amount: 1230.5, total: 121205.25 },
    { price: 98.55, amount: 670.8, total: 66118.24 },
    { price: 98.6, amount: 1450.3, total: 143039.58 },
    { price: 98.65, amount: 890.7, total: 87864.86 },
    { price: 98.7, amount: 1120.4, total: 110543.48 },
    { price: 98.75, amount: 560.9, total: 55408.88 },
    { price: 98.8, amount: 780.6, total: 77123.28 },
  ]

  const spread = asks[0].price - bids[0].price
  const spreadPercent = (spread / bids[0].price) * 100

  const getDepthPercentage = (total: number, maxTotal: number) => {
    return (total / maxTotal) * 100
  }

  const maxBidTotal = Math.max(...bids.map((b) => b.total))
  const maxAskTotal = Math.max(...asks.map((a) => a.total))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Order Book
          </div>
          <Badge variant="outline" className="text-xs">
            SOL/USDC
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-4 py-2 border-b">
          <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
            <div>Price (USDC)</div>
            <div className="text-right">Amount (SOL)</div>
            <div className="text-right">Total (USDC)</div>
          </div>
        </div>

        {/* Asks (Sell Orders) */}
        <div className="max-h-[200px] overflow-y-auto">
          {asks.reverse().map((ask, index) => (
            <div
              key={index}
              className="relative px-4 py-1 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer group"
            >
              <div
                className="absolute right-0 top-0 h-full bg-red-100 dark:bg-red-900/20"
                style={{ width: `${getDepthPercentage(ask.total, maxAskTotal)}%` }}
              />
              <div className="relative grid grid-cols-3 gap-4 text-xs">
                <div className="text-red-600 dark:text-red-400 font-mono">{ask.price.toFixed(2)}</div>
                <div className="text-right font-mono">{ask.amount.toFixed(1)}</div>
                <div className="text-right font-mono text-gray-600 dark:text-gray-400">
                  {ask.total.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Spread */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-y">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Spread:</span>
              <span className="font-mono">${spread.toFixed(2)}</span>
              <Badge variant="outline" className="text-xs">
                {spreadPercent.toFixed(3)}%
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">Tight</span>
            </div>
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="max-h-[200px] overflow-y-auto">
          {bids.map((bid, index) => (
            <div
              key={index}
              className="relative px-4 py-1 hover:bg-green-50 dark:hover:bg-green-900/10 cursor-pointer group"
            >
              <div
                className="absolute right-0 top-0 h-full bg-green-100 dark:bg-green-900/20"
                style={{ width: `${getDepthPercentage(bid.total, maxBidTotal)}%` }}
              />
              <div className="relative grid grid-cols-3 gap-4 text-xs">
                <div className="text-green-600 dark:text-green-400 font-mono">{bid.price.toFixed(2)}</div>
                <div className="text-right font-mono">{bid.amount.toFixed(1)}</div>
                <div className="text-right font-mono text-gray-600 dark:text-gray-400">
                  {bid.total.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="px-4 py-3 border-t bg-gray-50/50 dark:bg-gray-800/50">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Bids:</span>
                <span className="text-green-600 font-semibold">
                  {bids.reduce((sum, bid) => sum + bid.amount, 0).toFixed(0)} SOL
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Bid Volume:</span>
                <span className="font-mono">${bids.reduce((sum, bid) => sum + bid.total, 0).toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Asks:</span>
                <span className="text-red-600 font-semibold">
                  {asks.reduce((sum, ask) => sum + ask.amount, 0).toFixed(0)} SOL
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ask Volume:</span>
                <span className="font-mono">${asks.reduce((sum, ask) => sum + ask.total, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
