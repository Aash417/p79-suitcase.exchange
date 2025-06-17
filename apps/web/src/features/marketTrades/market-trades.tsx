'use client';

import { OrderBookAndTrades } from '@/components/orderbook-trades';
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
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

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

   // Mobile collapsible states
   const [isOrderbookCollapsed, setIsOrderbookCollapsed] = useState(true);
   const [isSwapCollapsed, setIsSwapCollapsed] = useState(true); // Trading should be open by default
   const [isDepositCollapsed, setIsDepositCollapsed] = useState(true);
   const [isDashboardCollapsed, setIsDashboardCollapsed] = useState(true);
   const [isTradesCollapsed, setIsTradesCollapsed] = useState(true);

   // Refs for scrolling to expanded sections
   const swapRef = useRef<HTMLDivElement>(null);
   const orderbookRef = useRef<HTMLDivElement>(null);
   const tradesRef = useRef<HTMLDivElement>(null);
   const dashboardRef = useRef<HTMLDivElement>(null);
   const depositRef = useRef<HTMLDivElement>(null);

   // Auto-scroll to section when expanded on mobile
   useEffect(() => {
      if (!isSwapCollapsed && swapRef.current) {
         setTimeout(() => {
            swapRef.current?.scrollIntoView({
               behavior: 'smooth',
               block: 'start'
            });
         }, 100); // Small delay to allow rendering
      }
   }, [isSwapCollapsed]);

   useEffect(() => {
      if (!isOrderbookCollapsed && orderbookRef.current) {
         setTimeout(() => {
            orderbookRef.current?.scrollIntoView({
               behavior: 'smooth',
               block: 'start'
            });
         }, 100);
      }
   }, [isOrderbookCollapsed]);

   useEffect(() => {
      if (!isTradesCollapsed && tradesRef.current) {
         setTimeout(() => {
            tradesRef.current?.scrollIntoView({
               behavior: 'smooth',
               block: 'start'
            });
         }, 100);
      }
   }, [isTradesCollapsed]);

   useEffect(() => {
      if (!isDashboardCollapsed && dashboardRef.current) {
         setTimeout(() => {
            dashboardRef.current?.scrollIntoView({
               behavior: 'smooth',
               block: 'start'
            });
         }, 100);
      }
   }, [isDashboardCollapsed]);

   useEffect(() => {
      if (!isDepositCollapsed && depositRef.current) {
         setTimeout(() => {
            depositRef.current?.scrollIntoView({
               behavior: 'smooth',
               block: 'start'
            });
         }, 100);
      }
   }, [isDepositCollapsed]);

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

   // Auto-scroll to section when opened (mobile)
   useEffect(() => {
      if (!isOrderbookCollapsed && orderbookRef.current) {
         orderbookRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [isOrderbookCollapsed]);
   useEffect(() => {
      if (!isSwapCollapsed && swapRef.current) {
         swapRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [isSwapCollapsed]);
   useEffect(() => {
      if (!isDepositCollapsed && depositRef.current) {
         depositRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [isDepositCollapsed]);
   useEffect(() => {
      if (!isDashboardCollapsed && dashboardRef.current) {
         dashboardRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [isDashboardCollapsed]);
   useEffect(() => {
      if (!isTradesCollapsed && tradesRef.current) {
         tradesRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [isTradesCollapsed]);

   return (
      <div className="w-full h-screen overflow-y-auto">
         {/* Desktop Layout (lg:) */}
         <div className="flex-row hidden w-full gap-2 px-4 py-1 lg:flex bg-base-background-l0">
            {/* Left section: 3/4 width */}
            <div className="flex flex-col w-3/4 h-full gap-2 rounded-sm">
               {/* Top child */}
               <div className="flex flex-col gap-2">
                  {/* Top inner child: 10% of viewport height */}
                  <div className="h-[10vh] bg-base-background-l1 rounded-sm flex items-center justify-center">
                     {loadingTicker ? (
                        <div className=""></div>
                     ) : (
                        <Ticker newTicker={newTicker} isPriceUp={isPriceUp} />
                     )}
                  </div>

                  {/* Bottom inner child: 90% of viewport height */}
                  <div className="h-[88vh] rounded-sm flex flex-row gap-2 w-full">
                     {/* First child: 2/3 of viewport width */}
                     <div className="flex items-center justify-center w-2/3 h-full rounded-sm bg-base-background-l1">
                        <KlineChart />
                     </div>
                     {/* Second child: 1/3 of viewport width */}
                     <div className="flex items-center justify-center w-1/3 h-full rounded-sm bg-base-background-l1">
                        <OrderBookAndTrades
                           topAsks={topAsks}
                           topBids={topBids}
                           isPriceUp={isPriceUp}
                           lastPrice={newTicker.lastPrice}
                           loadingDepth={loadingDepth}
                           loadingTrades={loadingTrades}
                           newTrades={newTrades}
                        />
                     </div>
                  </div>
               </div>

               {/* Bottom child */}
               <div className="h-[58vh] bg-base-background-l1 rounded-sm flex items-center justify-center">
                  <Dashboard />
               </div>
            </div>

            {/* Right section: 1/4 width */}
            <div className="w-1/4 h-[100vh] rounded-sm flex flex-col gap-2">
               {/* Top child */}
               <div className="h-[60vh] bg-base-background-l1 rounded-sm">
                  <SwapForm />
               </div>
               {/* Bottom child */}
               <div className="h-[35vh] bg-base-background-l1 rounded-sm">
                  <DepositForm />
               </div>
            </div>
         </div>

         {/* Mobile Layout (up to lg) */}
         <div className="flex flex-col min-h-screen gap-4 p-4 lg:hidden">
            {/* Mobile Ticker - Always visible */}
            <div className="h-[72px] bg-base-background-l1 w-full rounded-lg">
               {loadingTicker ? (
                  <div className=""></div>
               ) : (
                  <Ticker newTicker={newTicker} isPriceUp={isPriceUp} />
               )}
            </div>

            {/* Mobile Chart - Always visible */}
            <div className="flex flex-col bg-base-background-l1 h-[300px] sm:h-[400px] overflow-hidden rounded-lg">
               <div className="h-full tradingview-chart">
                  <KlineChart />
               </div>
            </div>

            {/* Mobile Trading Forms */}
            <div className="flex flex-col gap-4">
               {/* Medium device layout - Orderbook and Swap side by side */}
               <div className="hidden md:flex md:gap-4">
                  {/* Orderbook - Left side on medium+ */}
                  <div className="flex-1 rounded-lg bg-base-background-l1">
                     <div className="px-4 py-3">
                        <span className="text-lg font-semibold text-high-emphasis">
                           Order Book
                        </span>
                     </div>
                     <div className="px-4 pb-4 h-[400px] overflow-hidden">
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
                  </div>

                  {/* Swap Form - Right side on medium+ */}
                  <div className="flex-1 rounded-lg bg-base-background-l1">
                     <div className="px-4 py-3">
                        <span className="text-lg font-semibold text-high-emphasis">
                           Trade
                        </span>
                     </div>
                     <div className="px-4 pb-4">
                        <SwapForm />
                     </div>
                  </div>
               </div>

               {/* Small device layout - Stacked (mobile phones) */}
               <div className="flex flex-col gap-4 md:hidden">
                  {/* Swap Form */}
                  <div
                     className="rounded-lg bg-base-background-l1"
                     ref={swapRef}
                  >
                     <button
                        onClick={() => setIsSwapCollapsed(!isSwapCollapsed)}
                        className="flex items-center justify-between w-full px-4 py-3 text-left focus:outline-none"
                     >
                        <span className="text-lg font-semibold text-high-emphasis">
                           Trade
                        </span>
                        {isSwapCollapsed ? (
                           <ChevronDown className="w-5 h-5 text-med-emphasis" />
                        ) : (
                           <ChevronUp className="w-5 h-5 text-med-emphasis" />
                        )}
                     </button>
                     {!isSwapCollapsed && (
                        <div className="px-4 pb-4">
                           <SwapForm />
                        </div>
                     )}
                  </div>

                  {/* Orderbook */}
                  <div
                     className="rounded-lg bg-base-background-l1"
                     ref={orderbookRef}
                  >
                     <button
                        onClick={() =>
                           setIsOrderbookCollapsed(!isOrderbookCollapsed)
                        }
                        className="flex items-center justify-between w-full px-4 py-3 text-left focus:outline-none"
                     >
                        <span className="text-lg font-semibold text-high-emphasis">
                           Order Book
                        </span>
                        {isOrderbookCollapsed ? (
                           <ChevronDown className="w-5 h-5 text-med-emphasis" />
                        ) : (
                           <ChevronUp className="w-5 h-5 text-med-emphasis" />
                        )}
                     </button>
                     {!isOrderbookCollapsed && (
                        <div className="px-4 pb-4 h-[600px] overflow-hidden">
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
                     )}
                  </div>
               </div>

               {/* Recent Trades */}
               <div
                  className="rounded-lg bg-base-background-l1"
                  ref={tradesRef}
               >
                  <button
                     onClick={() => setIsTradesCollapsed(!isTradesCollapsed)}
                     className="flex items-center justify-between w-full px-4 py-3 text-left focus:outline-none"
                  >
                     <span className="text-lg font-semibold text-high-emphasis">
                        Recent Trades
                     </span>
                     {isTradesCollapsed ? (
                        <ChevronDown className="w-5 h-5 text-med-emphasis" />
                     ) : (
                        <ChevronUp className="w-5 h-5 text-med-emphasis" />
                     )}
                  </button>
                  {!isTradesCollapsed && (
                     <div className="px-4 pb-4 h-[300px] overflow-hidden">
                        {loadingTrades ? (
                           <div className=""></div>
                        ) : (
                           <Trades newTrades={newTrades} />
                        )}
                     </div>
                  )}
               </div>

               {/* Dashboard */}
               <div
                  className="rounded-lg bg-base-background-l1"
                  ref={dashboardRef}
               >
                  <button
                     onClick={() =>
                        setIsDashboardCollapsed(!isDashboardCollapsed)
                     }
                     className="flex items-center justify-between w-full px-4 py-3 text-left focus:outline-none"
                  >
                     <span className="text-lg font-semibold text-high-emphasis">
                        Portfolio
                     </span>
                     {isDashboardCollapsed ? (
                        <ChevronDown className="w-5 h-5 text-med-emphasis" />
                     ) : (
                        <ChevronUp className="w-5 h-5 text-med-emphasis" />
                     )}
                  </button>
                  {!isDashboardCollapsed && (
                     <div className="px-4 pb-4 overflow-hidden h-[350px]">
                        <Dashboard />
                     </div>
                  )}
               </div>

               {/* Deposit Form */}
               <div
                  className="rounded-lg bg-base-background-l1"
                  ref={depositRef}
               >
                  <button
                     onClick={() => setIsDepositCollapsed(!isDepositCollapsed)}
                     className="flex items-center justify-between w-full px-4 py-3 text-left focus:outline-none"
                  >
                     <span className="text-lg font-semibold text-high-emphasis">
                        Deposit
                     </span>
                     {isDepositCollapsed ? (
                        <ChevronDown className="w-5 h-5 text-med-emphasis" />
                     ) : (
                        <ChevronUp className="w-5 h-5 text-med-emphasis" />
                     )}
                  </button>
                  {!isDepositCollapsed && (
                     <div className="px-4 pb-4">
                        <DepositForm />
                     </div>
                  )}
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
