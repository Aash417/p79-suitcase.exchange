'use client';

import { MessageLoading } from '@/components/ui/message-loading';
import { useGetDepth } from '@/hooks';
import { WebSocketManager } from '@/lib/websocket-manager';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AskTable } from './components/ask-table';
import { BidTable } from './components/bid-table';
import { LastTradePrice } from './components/last-trade-price';
import { TableHeader } from './components/table-header';

export function Orderbook() {
   const market = useParams<{ market: string }>().market || '';
   const { data: depthData, isLoading } = useGetDepth(market);

   const [bids, setBids] = useState<[string, string][]>([]);
   const [asks, setAsks] = useState<[string, string][]>([]);

   useEffect(() => {
      if (depthData) {
         setBids(depthData.bids);
         setAsks(depthData.asks);
      }

      function handleDepthUpdate(data: {
         bids: [string, string][];
         asks: [string, string][];
      }) {
         setBids((prevBids) => updateBids(prevBids, data.bids));
         setAsks((prevAsks) => updateAsks(prevAsks, data.asks));
      }

      const wsManager = WebSocketManager.getInstance();
      wsManager.registerCallback(
         'depth',
         handleDepthUpdate,
         `depth.1000ms.${market}`
      );
      wsManager.sendMessage({
         method: 'SUBSCRIBE',
         params: [`depth.1000ms.${market}`]
      });

      return () => {
         wsManager.sendMessage({
            method: 'UNSUBSCRIBE',
            params: [`depth.1000ms.${market}`]
         });
         wsManager.deRegisterCallback('depth', `depth.1000ms.${market}`);
      };
   }, [depthData, market]);

   const topBids = useMemo(() => bids.slice(0, 10), [bids]);
   const topAsks = useMemo(() => asks.slice(0, 10), [asks]);

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-full">
            <MessageLoading />
         </div>
      );
   }

   return (
      <div className="flex flex-col h-full grow overflow-x-hidden">
         <TableHeader />

         <div className="flex flex-col no-scrollbar h-full flex-1 overflow-y-auto pb-1">
            <AskTable asks={topAsks} />
            <LastTradePrice />
            <BidTable bids={topBids} />
         </div>

         {/* <OrderbookStatus/> */}
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
