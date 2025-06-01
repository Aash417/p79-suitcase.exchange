'use client';

import { useGetTicker } from '@/hooks';
import { WebSocketManager } from '@/lib/websocket-manager';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function LastTradePrice() {
   const market = useParams<{ market: string }>().market || '';
   const { data: ticker } = useGetTicker(market);

   const [tickerPrice, setTickerPrice] = useState<string | undefined>(
      ticker?.lastPrice
   );
   const [isPriceUp, setIsPriceUp] = useState(false);

   useEffect(() => {
      if (!market) return;

      const handleTickerUpdate = (data: {
         lastPrice: string;
         firstPrice: string;
      }) => {
         if (data.lastPrice) {
            setTickerPrice(data.lastPrice);
            const isUp = Number(data.firstPrice) < Number(data.lastPrice);
            setIsPriceUp(isUp);
         }
      };

      const wsManager = WebSocketManager.getInstance();
      const callbackId = `ticker.${market}`;

      wsManager.registerCallback('ticker', handleTickerUpdate, callbackId);

      return () => {
         wsManager.sendMessage({
            method: 'UNSUBSCRIBE',
            params: [`ticker.${market}`]
         });
         wsManager.deRegisterCallback('ticker', callbackId);
      };
   }, [market]);

   if (!tickerPrice) return null;

   return (
      <div className="flex flex-col bg-base-background-l1 z-10 flex-0 snap-center px-3 py-1 sticky bottom-0">
         <div className="flex justify-between flex-row">
            <div className="flex items-center flex-row gap-1.5">
               <p
                  className={`font-medium tabular-nums ${
                     isPriceUp ? 'text-green-text' : 'text-red-text'
                  }`}
               >
                  {tickerPrice}
               </p>
            </div>
         </div>
      </div>
   );
}
