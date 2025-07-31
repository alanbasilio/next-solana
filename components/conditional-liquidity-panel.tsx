'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components';
import { useConditionalLiquidity, useWallet } from '@/hooks';

export const ConditionalLiquidityPanel = () => {
  const walletState = useWallet();
  const {
    activeSwaps,
    toxicityMetrics,
    createDeclarativeSwap,
    executeDeclarativeSwap,
    getToxicityMetrics,
    getOptimalSpread,
    getSegmentInfo,
  } = useConditionalLiquidity();

  const [swapForm, setSwapForm] = useState({
    fromToken: 'SOL',
    toToken: 'USDC',
    amount: '',
    maxSlippage: '0.5',
    intent: 'retail' as 'retail' | 'institutional' | 'arbitrage',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateSwap = () => {
    if (!swapForm.amount || !walletState.publicKey) return;

    const swap = createDeclarativeSwap(
      swapForm.fromToken,
      swapForm.toToken,
      parseFloat(swapForm.amount),
      parseFloat(swapForm.maxSlippage) / 100,
      swapForm.intent,
      swapForm.priority
    );

    console.log('Created declarative swap:', swap);
  };

  const handleExecuteSwap = async (swapId: string) => {
    if (!walletState.publicKey) return;

    setIsLoading(true);
    try {
      const result = await executeDeclarativeSwap(
        swapId,
        walletState.publicKey
      );
      if (result.success) {
        console.log('Swap executed successfully:', result.txHash);
      } else {
        console.error('Swap execution failed:', result.error);
      }
    } catch (error) {
      console.error('Error executing swap:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toxicityScore = walletState.publicKey
    ? getToxicityMetrics(walletState.publicKey)?.score || 0
    : 0;

  const segmentInfo = getSegmentInfo(toxicityScore);
  const optimalSpread = walletState.publicKey
    ? getOptimalSpread(walletState.publicKey, 0.003, 100)
    : 0.003;

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Conditional Liquidity</CardTitle>
          <CardDescription>
            Liquidity segmentation with toxicity detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='overview' className='w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='create'>Create Swap</TabsTrigger>
              <TabsTrigger value='active'>Active Swaps</TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm'>Toxicity Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {(toxicityScore * 100).toFixed(1)}%
                    </div>
                    <Badge
                      variant={
                        toxicityScore < 0.3
                          ? 'default'
                          : toxicityScore < 0.7
                            ? 'secondary'
                            : 'destructive'
                      }
                      className='mt-2'
                    >
                      {toxicityScore < 0.3
                        ? 'Low'
                        : toxicityScore < 0.7
                          ? 'Medium'
                          : 'High'}
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm'>Segment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-lg font-semibold'>
                      {segmentInfo.segment}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {segmentInfo.description}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm'>Optimal Spread</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {(optimalSpread * 100).toFixed(2)}%
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      vs {(0.003 * 100).toFixed(2)}% base
                    </div>
                  </CardContent>
                </Card>
              </div>

              {toxicityMetrics && (
                <Card>
                  <CardHeader>
                    <CardTitle className='text-sm'>Toxicity Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                      <div>
                        <div className='font-medium'>Trade Frequency</div>
                        <div className='text-muted-foreground'>
                          {toxicityMetrics.tradeFrequency} trades
                        </div>
                      </div>
                      <div>
                        <div className='font-medium'>Avg Trade Size</div>
                        <div className='text-muted-foreground'>
                          ${toxicityMetrics.avgTradeSize.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className='font-medium'>Sandwich Attempts</div>
                        <div className='text-muted-foreground'>
                          {toxicityMetrics.sandwichAttempts}
                        </div>
                      </div>
                      <div>
                        <div className='font-medium'>Frontrun Attempts</div>
                        <div className='text-muted-foreground'>
                          {toxicityMetrics.frontrunAttempts}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value='create' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Create Declarative Swap</CardTitle>
                  <CardDescription>
                    Create a swap with intent-based liquidity segmentation
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='text-sm font-medium'>From Token</label>
                      <Input
                        value={swapForm.fromToken}
                        onChange={e =>
                          setSwapForm(prev => ({
                            ...prev,
                            fromToken: e.target.value,
                          }))
                        }
                        placeholder='SOL'
                      />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>To Token</label>
                      <Input
                        value={swapForm.toToken}
                        onChange={e =>
                          setSwapForm(prev => ({
                            ...prev,
                            toToken: e.target.value,
                          }))
                        }
                        placeholder='USDC'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='text-sm font-medium'>Amount</label>
                      <Input
                        type='number'
                        value={swapForm.amount}
                        onChange={e =>
                          setSwapForm(prev => ({
                            ...prev,
                            amount: e.target.value,
                          }))
                        }
                        placeholder='100'
                      />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>
                        Max Slippage (%)
                      </label>
                      <Input
                        type='number'
                        value={swapForm.maxSlippage}
                        onChange={e =>
                          setSwapForm(prev => ({
                            ...prev,
                            maxSlippage: e.target.value,
                          }))
                        }
                        placeholder='0.5'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='text-sm font-medium'>Intent</label>
                      <select
                        value={swapForm.intent}
                        onChange={e =>
                          setSwapForm(prev => ({
                            ...prev,
                            intent: e.target.value as
                              | 'retail'
                              | 'institutional'
                              | 'arbitrage',
                          }))
                        }
                        className='w-full p-2 border rounded-md'
                      >
                        <option value='retail'>Retail</option>
                        <option value='institutional'>Institutional</option>
                        <option value='arbitrage'>Arbitrage</option>
                      </select>
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Priority</label>
                      <select
                        value={swapForm.priority}
                        onChange={e =>
                          setSwapForm(prev => ({
                            ...prev,
                            priority: e.target.value as
                              | 'low'
                              | 'medium'
                              | 'high',
                          }))
                        }
                        className='w-full p-2 border rounded-md'
                      >
                        <option value='low'>Low</option>
                        <option value='medium'>Medium</option>
                        <option value='high'>High</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateSwap}
                    disabled={!swapForm.amount || !walletState.publicKey}
                    className='w-full'
                  >
                    Create Declarative Swap
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='active' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Active Declarative Swaps</CardTitle>
                  <CardDescription>
                    Manage your pending declarative swaps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activeSwaps.length === 0 ? (
                    <div className='text-center py-8 text-muted-foreground'>
                      No active declarative swaps
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {activeSwaps.map(swap => (
                        <Card key={swap.id}>
                          <CardContent className='pt-6'>
                            <div className='flex justify-between items-start'>
                              <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                  <span className='font-medium'>
                                    {swap.fromToken} → {swap.toToken}
                                  </span>
                                  <Badge variant='outline'>{swap.intent}</Badge>
                                  <Badge variant='secondary'>
                                    {swap.priority}
                                  </Badge>
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                  Amount: {swap.amount} | Max Slippage:{' '}
                                  {(swap.maxSlippage * 100).toFixed(2)}%
                                </div>
                                <div className='text-xs text-muted-foreground'>
                                  Created:{' '}
                                  {new Date(swap.timestamp).toLocaleString()}
                                </div>
                              </div>
                              <Button
                                onClick={() => handleExecuteSwap(swap.id)}
                                disabled={isLoading || !walletState.publicKey}
                                size='sm'
                              >
                                {isLoading ? 'Executing...' : 'Execute'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
