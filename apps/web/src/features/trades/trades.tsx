'use client';

import { MessageLoading } from '@/components/ui/message-loading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetTrades } from '@/hooks';
import { WebSocketManager } from '@/lib/websocket-manager';
import { Trade } from '@suitcase/shared-types/messages/client-api';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Trades() {
   const [newTrades, setNewTrades] = useState<Trade[]>([]);
   const { market } = useParams<{ market: string }>();
   const { data: trades, isLoading } = useGetTrades(market);

   useEffect(() => {
      setNewTrades(trades ?? []);

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
   }, [market, trades]);

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-full">
            <MessageLoading />
         </div>
      );
   }

   return (
      <div className="flex flex-col grow overflow-y-hidden">
         <div className="flex flex-col h-full px-3">
            {/* heading */}
            <div className="flex justify-between flex-row w-2/3">
               <p className="text-med-emphasis px-1 text-left text-xs font-semibold">
                  Price (USDC)
               </p>
               <p className="text-med-emphasis px-1 text-left text-xs font-semibold">
                  Qty (SOL)
               </p>
            </div>

            {/* data */}
            <div className="flex flex-col no-scrollbar overflow-y-auto">
               <ScrollArea className="h-[75dvh] rounded-md">
                  {newTrades.map((trade, idx) => (
                     <div
                        key={idx + 1}
                        className="flex flex-row w-full cursor-default bg-transparent hover:bg-white/4"
                     >
                        <div className="flex items-center flex-row w-[33.3%] py-1">
                           <p
                              className={`w-full text-sm font-normal capitalize tabular-nums px-1 text-left ${
                                 trade.isBuyerMaker
                                    ? 'text-[#F6465D]'
                                    : 'text-[#0ECB81]'
                              }`}
                           >
                              {parseFloat(trade.price).toFixed(2)}
                           </p>
                        </div>
                        <div className="flex items-center flex-row w-[33.3%] py-1">
                           <p className="text-high-emphasis/90 w-full text-sm font-normal capitalize tabular-nums text-right">
                              {trade.quantity}
                           </p>
                        </div>
                        <div className="flex items-center flex-row w-[33.3%] py-1">
                           <p className="w-full text-sm font-normal capitalize tabular-nums text-med-emphasis text-right">
                              {formatTimestamp(trade.timestamp)}
                           </p>
                        </div>
                     </div>
                  ))}
               </ScrollArea>
            </div>
         </div>
      </div>
   );
}

const formatTimestamp = (timestamp: number) => {
   const date = new Date(timestamp);
   return date.toTimeString().split(' ')[0];
};
