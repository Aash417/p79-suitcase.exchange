'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Trade } from '@repo/shared-types/messages/client-api';

type Props = {
   newTrades: Trade[];
};
export function Trades({ newTrades }: Readonly<Props>) {
   return (
      <div className="flex flex-col grow overflow-y-hidden">
         {/* Desktop Layout */}
         <div className="hidden sm:flex flex-col h-full px-3">
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

         {/* Mobile Layout */}
         <div className="sm:hidden flex flex-col h-full px-2">
            <ScrollArea className="h-[50vh] rounded-md">
               <div className="space-y-2">
                  {newTrades.map((trade, idx) => (
                     <div
                        key={idx + 1}
                        className="bg-white/5 rounded-lg p-3 border border-white/10"
                     >
                        <div className="flex justify-between items-center mb-2">
                           <span
                              className={`text-lg font-semibold tabular-nums ${
                                 trade.isBuyerMaker
                                    ? 'text-[#F6465D]'
                                    : 'text-[#0ECB81]'
                              }`}
                           >
                              ${parseFloat(trade.price).toFixed(2)}
                           </span>
                           <span className="text-xs text-med-emphasis">
                              {formatTimestamp(trade.timestamp)}
                           </span>
                        </div>

                        <div className="flex justify-between items-center">
                           <div className="flex flex-col">
                              <span className="text-xs text-med-emphasis">
                                 Quantity
                              </span>
                              <span className="text-sm text-high-emphasis/90 font-medium">
                                 {trade.quantity} SOL
                              </span>
                           </div>
                           <div className="flex flex-col items-end">
                              <span className="text-xs text-med-emphasis">
                                 Side
                              </span>
                              <span
                                 className={`text-sm font-medium ${
                                    trade.isBuyerMaker
                                       ? 'text-[#F6465D]'
                                       : 'text-[#0ECB81]'
                                 }`}
                              >
                                 {trade.isBuyerMaker ? 'Sell' : 'Buy'}
                              </span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </ScrollArea>
         </div>
      </div>
   );
}

const formatTimestamp = (timestamp: number) => {
   const date = new Date(timestamp);
   return date.toTimeString().split(' ')[0];
};
