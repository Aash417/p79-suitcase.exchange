'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { type Trades } from '@/lib/types';
import { WebSocketManager } from '@/lib/websocket-manager';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = { trades: Trades[] };

export default function Trades({ trades }: Readonly<Props>) {
   const [newTrades, setNewTrades] = useState<Trades[]>([]);
   const { market } = useParams<{ market: string }>();

   useEffect(() => {
      setNewTrades(trades);

      function handleTradeUpdate(data: Trades) {
         const newTrade = {
            id: data.id,
            price: data.price,
            quantity: data.quantity,
            quoteQuantity: '',
            timestamp: data.timestamp,
            isBuyerMaker: data.isBuyerMaker,
         };
         setNewTrades((prev) => [newTrade, ...prev].slice(0, 30));
      }

      const wsManager = WebSocketManager.getInstance();
      const callbackId = `trade.${market}`;

      wsManager.registerCallback('trade', handleTradeUpdate, callbackId);
      wsManager.sendMessage({
         method: 'SUBSCRIBE',
         params: [`trade.${market}`],
      });

      return () => {
         wsManager.sendMessage({
            method: 'UNSUBSCRIBE',
            params: [`trade.${market}`],
         });
         wsManager.deRegisterCallback('trade', callbackId);
      };
   }, []);

   if (!newTrades) {
      return <div className="text-white">Loading...</div>;
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
               <ScrollArea className="h-[70dvh] rounded-md">
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
