/* eslint-disable @next/next/no-img-element */
'use client';

import { MessageLoading } from '@/components/ui/message-loading';
import { useGetTicker } from '@/hooks';
import { formatComma, formatPrice } from '@/lib/utils';
import { WebSocketManager } from '@/lib/websocket-manager';
import type { Ticker } from '@suitcase/shared-types/messages/client-api';
import { useParams } from 'next/navigation';
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

export function Ticker() {
   const market = useParams<{ market: string }>().market || '';
   const { data: ticker, isLoading } = useGetTicker(market);

   const [newTicker, setNewTicker] = useState<
      Ticker & { [key: string]: string }
   >();
   const [isPriceUp, setIsPriceUp] = useState(false);

   useEffect(() => {
      setNewTicker(ticker);

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
   }, [market, ticker, newTicker]);

   if (isLoading || !newTicker) {
      return (
         <div className="flex items-center justify-center h-full">
            <MessageLoading />
         </div>
      );
   }

   return (
      <div className="flex flex-row shrink-0 gap-[32px]">
         <div className="flex items-center justify-between flex-row bg-base-background-l2 rounded-xl p-2 hover:opacity-90">
            <div className="flex flex-row mr-2">
               <div className="flex items-center   gap-2">
                  <div className="size-8  rounded-full overflow-hidden">
                     <img
                        src={newTicker.imageUrl}
                        alt=""
                        className="object-cover w-full h-full"
                     />
                  </div>
                  <p className="font-medium text-high-emphasis text-nowrap">
                     {market?.split('_')[0]}
                     <span className="text-slate-500">
                        /{market?.split('_')[1]}
                     </span>
                  </p>
               </div>
            </div>
         </div>

         <div className="flex items-center flex-row flex-wrap gap-x-6">
            <div className="flex flex-col h-full justify-center">
               <PriceDisplay price={newTicker.lastPrice} isUp={isPriceUp} />
               <p className="text-high-emphasis text-left text-sm font-normal tabular-nums">
                  {formatPrice(newTicker.lastPrice)}
               </p>
            </div>

            <div className="flex justify-center flex-col relative">
               <p className="font-medium text-gray-400 text-xs">24H Change</p>
               <span
                  className={`mt-1 text-sm leading-4 font-normal tabular-nums ${
                     Number(newTicker?.priceChange) > 0
                        ? 'text-green-500'
                        : 'text-red-500'
                  }`}
               >
                  {Number(newTicker?.priceChange) > 0 ? '+' : ''}{' '}
                  {newTicker?.priceChange} {Number(newTicker?.change)}%
               </span>
            </div>

            <div className="flex justify-center flex-col relative">
               <p className="font-medium text-gray-400 text-xs">24H High</p>
               <span className="text-high-emphasis mt-1 text-sm leading-4 font-normal tabular-nums">
                  {formatComma(newTicker.high)}
               </span>
            </div>

            <div className="flex justify-center flex-col relative">
               <p className="font-medium text-gray-400 text-xs">24H Low</p>
               <span className="text-high-emphasis mt-1 text-sm leading-4 font-normal tabular-nums">
                  {formatComma(newTicker.low)}
               </span>
            </div>

            <div className="flex justify-center flex-col relative">
               <p className="font-medium text-gray-400 text-xs">
                  24H Volume ({market?.split('_')[1]})
               </p>
               <span className="text-high-emphasis mt-1 text-sm leading-4 font-normal tabular-nums">
                  {formatComma(newTicker.volume)}
               </span>
            </div>
         </div>
      </div>
   );
}

function PriceDisplay({
   price,
   isUp
}: Readonly<{ price: string; isUp: boolean }>) {
   return (
      <p
         className={`font-medium tabular-nums ${
            isUp ? 'text-green-text' : 'text-red-text'
         } text-lg`}
      >
         {formatPrice(price)}
      </p>
   );
}
