'use client';

import { WebSocketManager } from '@/lib/websocketManager';
import { useEffect, useMemo, useState } from 'react';
import { AskTable } from './components/askTable';
import { BidTable } from './components/bidTable';
import { Depth } from './utils/types';

type Props = {
   market: string;
   depthData: Depth;
};

export default function Orderbook({ market, depthData }: Readonly<Props>) {
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
      wsManager.sendMessage({
         method: 'SUBSCRIBE',
         params: [`depth.200ms.${market}`],
      });

      return () => {
         wsManager.sendMessage({
            method: 'UNSUBSCRIBE',
            params: [`depth.200ms.${market}`],
         });
         wsManager.deRegisterCallback('depth', `depth.200ms.${market}`);
      };
   }, []);

   const topBids = useMemo(() => bids.slice(0, 11).reverse(), [bids]);
   const topAsks = useMemo(() => asks.slice(0, 11), [asks]);

   return (
      <div className="m-2">
         <TableHeader />
         <AskTable asks={topAsks} />
         <BidTable bids={topBids} />
      </div>
   );
}

function TableHeader() {
   return (
      <div className="flex justify-between text-xs font-medium">
         <div className="text-white">Price(USDC)</div>
         <div className="text-slate-500">Size(SOL)</div>
         <div className="text-slate-500">Total(SOL)</div>
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
