'use client';

import { Ticker } from '@/lib/types';
import { WebSocketManager } from '@/lib/websocket-manager';
import { useEffect, useState } from 'react';

type TickerUpdate = {
   firstPrice: string;
   lastPrice: string;
   high: string;
   low: string;
   volume: string;
   quoteVolume: string;
   symbol: string;
};

type Props = {
   ticker?: Ticker & { change: string; name: string; imageUrl: string };
};

export function LastTradePrice({ ticker }: Readonly<Props>) {
   const market = ticker?.symbol;
   const [tickerPrice, setTickerPrice] = useState<string | undefined>(
      ticker?.lastPrice,
   );
   const [isPriceUp, setIsPriceUp] = useState(false);

   useEffect(() => {
      if (!market) return;

      const handleTickerUpdate = (data: TickerUpdate) => {
         try {
            if (data.lastPrice) {
               setTickerPrice(data.lastPrice);
               const isUp = Number(data.firstPrice) < Number(data.lastPrice);
               setIsPriceUp(isUp);
            }
         } catch (error) {
            // Handle error silently or log to error tracking service
            console.log('Error parsing ticker data:', error);
         }
      };

      const wsManager = WebSocketManager.getInstance();
      const callbackId = `ticker.${market}`;

      wsManager.registerCallback('ticker', handleTickerUpdate, callbackId);

      return () => {
         wsManager.sendMessage({
            method: 'UNSUBSCRIBE',
            params: [`ticker.${market}`],
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
