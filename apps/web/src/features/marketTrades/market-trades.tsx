'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dashboard } from '@/features/dashboard/dashboard';
import { KlineChart } from '@/features/klineChart/klineChart';
import { DepositForm } from '@/features/onRampUI/deposit-form';
import { Orderbook } from '@/features/orderbook/orderbook';
import { SwapForm } from '@/features/swapUI/swap-form';
import { Ticker } from '@/features/ticker/ticker';
import { Trades } from '@/features/trades/trades';
import { useGetDepth, useGetTicker, useGetTrades } from '@/hooks';
import { WebSocketManager } from '@/lib/websocket-manager';
import type { Trade } from '@repo/shared-types/messages/client-api';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type TickerUpdate = {
   firstPrice: string;
   lastPrice: string;
   high: string;
   low: string;
   volume: string;
   quoteVolume: string;
   symbol: string;
};

export function MarketsTrades() {
   const market = useParams<{ market: string }>().market || '';

   const { data: depthData, isLoading: loadingDepth } = useGetDepth(market);
   const { data: ticker, isLoading: loadingTicker } = useGetTicker(market);
   const { data: trades, isLoading: loadingTrades } = useGetTrades(market);

   const [bids, setBids] = useState<[string, string][]>([]);
   const [asks, setAsks] = useState<[string, string][]>([]);
   const [newTicker, setNewTicker] = useState<{ [key: string]: string }>({});
   const [isPriceUp, setIsPriceUp] = useState(false);
   const [lastPrice, setLastPrice] = useState<string | undefined>(
      ticker?.lastPrice
   );
   const [newTrades, setNewTrades] = useState<Trade[]>([]);

   // handles initial data only
   useEffect(() => {
      if (depthData) {
         setBids(depthData.bids);
         setAsks(depthData.asks);
      }
   }, [depthData]);
   useEffect(() => {
      setNewTicker(ticker ?? {});
   }, [ticker]);
   useEffect(() => {
      setNewTrades(trades ?? []);
   }, [trades]);

   // handles orderbook updates
   useEffect(() => {
      function handleDepthUpdate(data: {
         bids: [string, string][];
         asks: [string, string][];
      }) {
         setBids((prevBids) => updateBids(prevBids, data.bids));
         setAsks((prevAsks) => updateAsks(prevAsks, data.asks));
      }
      const wsManager = WebSocketManager.getInstance();
      const callbackId = `depth.1000ms.${market}`;
      wsManager.registerCallback('depth', handleDepthUpdate, callbackId);
      wsManager.sendMessage({
         method: 'SUBSCRIBE',
         params: [`depth.1000ms.${market}`]
      });
      return () => {
         wsManager.sendMessage({
            method: 'UNSUBSCRIBE',
            params: [`depth.1000ms.${market}`]
         });
         wsManager.deRegisterCallback('depth', callbackId);
      };
   }, [market]);

   // handles ticker updates
   useEffect(() => {
      function handleTickerUpdate(data: TickerUpdate) {
         try {
            const firstPrice = parseFloat(data.firstPrice);
            const lastPrice = parseFloat(data.lastPrice);
            const priceChange = lastPrice - firstPrice;
            const priceChangePercent = (priceChange / firstPrice) * 100;
            setNewTicker((prev) => {
               if (!prev) return prev;
               return {
                  ...prev,
                  lastPrice: data.lastPrice,
                  priceChange: priceChange.toFixed(2),
                  change: priceChangePercent.toFixed(2),
                  high: data.high,
                  low: data.low,
                  volume: data.volume
               };
            });
            setIsPriceUp(priceChange > 0);
            setLastPrice(data.lastPrice);
         } catch (error) {
            if (error instanceof Error) {
               console.error('Ticker update error:', error.message);
            }
         }
      }
      const wsManager = WebSocketManager.getInstance();
      const callbackId = `ticker.${market}`;
      wsManager.registerCallback('ticker', handleTickerUpdate, callbackId);
      wsManager.sendMessage({
         method: 'SUBSCRIBE',
         params: [`ticker.${market}`]
      });
      return () => {
         wsManager.sendMessage({
            method: 'UNSUBSCRIBE',
            params: [`ticker.${market}`]
         });
         wsManager.deRegisterCallback('ticker', callbackId);
      };
   }, [market]);
   // handles trades updates
   useEffect(() => {
      function handleTradeUpdate(data: Trade) {
         const newTrade = {
            id: data.id,
            price: data.price,
            quantity: data.quantity,
            quoteQuantity: '',
            timestamp: data.timestamp,
            isBuyerMaker: data.isBuyerMaker
         };
         setNewTrades((prev) => [newTrade, ...prev].slice(0, 30));
      }
      const wsManager = WebSocketManager.getInstance();
      const callbackId = `trade.${market}`;
      wsManager.registerCallback('trade', handleTradeUpdate, callbackId);
      wsManager.sendMessage({
         method: 'SUBSCRIBE',
         params: [`trade.${market}`]
      });
      return () => {
         wsManager.sendMessage({
            method: 'UNSUBSCRIBE',
            params: [`trade.${market}`]
         });
         wsManager.deRegisterCallback('trade', callbackId);
      };
   }, [market]);

   const topBids = useMemo(() => bids.slice(0, 10), [bids]);
   const topAsks = useMemo(() => asks.slice(0, 10), [asks]);

   return (
      <div className="bg-base-background-l0 text-high-emphasis flex flex-1 flex-col overflow-auto">
         <div className="flex flex-col flex-1">
            <div className="flex flex-row mb-4 h-screen flex-1 gap-2 overflow-hidden px-4">
               {/* left */}
               <div className="flex flex-col flex-1 gap-2">
                  {/* upper dashboard */}
                  <div className="flex flex-col gap-2">
                     {/* ticker */}
                     <div className="flex items-center flex-row bg-base-background-l1 relative w-full rounded-lg">
                        <div className="flex items-center flex-row no-scrollbar mr-4 h-[72px] w-full overflow-auto pl-4">
                           <div className="flex justify-between flex-row w-full gap-4">
                              {loadingTicker ? (
                                 <div className=""></div>
                              ) : (
                                 <Ticker
                                    newTicker={newTicker}
                                    isPriceUp={isPriceUp}
                                 />
                              )}
                           </div>
                        </div>
                     </div>

                     {/* ui */}
                     <div className="flex flex-col">
                        <div className="flex flex-row relative gap-2">
                           {/* chart */}
                           <div className="flex flex-col bg-base-background-l1 flex-1 overflow-hidden rounded-lg">
                              <div className="tradingview-chart">
                                 <KlineChart />
                              </div>
                           </div>

                           {/* orderbook & Trades */}
                           <div className="flex flex-col bg-base-background-l1 w-1/3 max-w-[300px] min-w-[260px] overflow-hidden rounded-lg">
                              <div className="flex flex-col h-full">
                                 <Tabs defaultValue="book">
                                    <TabsList className="flex gap-2 mx-6 my-3 w-1/3 rounded-lg p-1">
                                       <TabsTrigger
                                          value="book"
                                          className="text-sm rounded-md data-[state=active]:bg-zinc-700/30 data-[state=active]:text-white text-zinc-400"
                                       >
                                          Book
                                       </TabsTrigger>
                                       <TabsTrigger
                                          value="trades"
                                          className="text-sm rounded-md data-[state=active]:bg-zinc-700/30 data-[state=active]:text-white text-zinc-400"
                                       >
                                          Trades
                                       </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="book">
                                       <div className="flex flex-col grow overflow-y-hidden">
                                          {loadingDepth ? (
                                             <div className=""></div>
                                          ) : (
                                             <Orderbook
                                                topAsks={topAsks}
                                                topBids={topBids}
                                                isPriceUp={isPriceUp}
                                                lastPrice={lastPrice ?? '0.00'}
                                             />
                                          )}
                                       </div>
                                    </TabsContent>

                                    <TabsContent value="trades">
                                       <div className="flex flex-col grow overflow-y-hidden">
                                          {loadingTrades ? (
                                             <div className=""></div>
                                          ) : (
                                             <div className="flex flex-col h-full">
                                                <div className="flex flex-col grow overflow-y-auto">
                                                   <Trades
                                                      newTrades={newTrades}
                                                   />
                                                </div>
                                             </div>
                                          )}
                                       </div>
                                    </TabsContent>
                                 </Tabs>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* lower dashboard */}
                  <div className="flex flex-col min-h-[50vh]">
                     <div className="flex flex-col bg-base-background-l1 relative overflow-hidden rounded-lg">
                        <Dashboard />
                     </div>
                  </div>
               </div>

               {/* right */}
               <div className="flex flex-col gap-2">
                  <div className="flex flex-col bg-base-background-l1 w-[332px] gap-4 rounded-lg px-[16px] py-[16px]">
                     <div className="basis-[28vw] bg-base-background-l1 rounded-md">
                        <SwapForm />
                     </div>
                  </div>

                  <div className="flex flex-col bg-base-background-l1 w-[332px] gap-4 rounded-lg px-[16px] py-[16px]">
                     <div className="basis-[15vw] bg-base-background-l1 rounded-md">
                        <DepositForm />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

function updateBids(prevBids: [string, string][], newBids: [string, string][]) {
   const bidMap = new Map(prevBids);
   newBids.forEach(([price, size]) => {
      if (size === '0.00') {
         bidMap.delete(price);
      } else {
         bidMap.set(price, size);
      }
   });
   return Array.from(bidMap.entries()).sort(
      (a, b) => Number(b[0]) - Number(a[0])
   );
}

function updateAsks(prevAsks: [string, string][], newAsks: [string, string][]) {
   const askMap = new Map(prevAsks);
   newAsks.forEach(([price, size]) => {
      if (size === '0.00') {
         askMap.delete(price);
      } else {
         askMap.set(price, size);
      }
   });
   return Array.from(askMap.entries()).sort(
      (a, b) => Number(a[0]) - Number(b[0])
   );
}
