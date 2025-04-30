'use client';

import { WebSocketManager } from '@/lib/websocket-manager';
import { useEffect, useMemo, useState } from 'react';
import { AskTable } from './components/ask-table';
import { BidTable } from './components/bid-table';
import LastTradePrice from './components/last-trade-price';
import { TableHeader } from './components/table-header';
import { Depth } from './utils/types';

type Props = {
   market: string;
   lastTradePrice?: string;
   depthData: Depth;
};

export default function Orderbook({
   market,
   depthData,
   lastTradePrice,
}: Readonly<Props>) {
   const [bids, setBids] = useState<[string, string][]>([]);
   const [asks, setAsks] = useState<[string, string][]>([]);

   useEffect(() => {
      setBids(depthData.bids);
      setAsks(depthData.asks);

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
         `depth.200ms.${market}`,
      );
      // wsManager.sendMessage({
      //    method: 'SUBSCRIBE',
      //    params: [`depth.200ms.${market}`],
      // });

      return () => {
         wsManager.sendMessage({
            method: 'UNSUBSCRIBE',
            params: [`depth.200ms.${market}`],
         });
         wsManager.deRegisterCallback('depth', `depth.200ms.${market}`);
      };
   }, []);

   const topBids = useMemo(() => bids.slice(0, 10), [bids]);
   const topAsks = useMemo(() => asks.slice(0, 10), [asks]);

   return (
      <div className="flex flex-col h-full grow overflow-x-hidden">
         <TableHeader />

         <div className="flex flex-col no-scrollbar h-full flex-1 overflow-y-auto">
            <AskTable asks={topAsks} />
            <LastTradePrice lastTradePrice={lastTradePrice} />
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
      (a, b) => Number(b[0]) - Number(a[0]),
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
      (a, b) => Number(a[0]) - Number(b[0]),
   );
}
