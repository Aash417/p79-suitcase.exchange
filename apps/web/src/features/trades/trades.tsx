'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Trade } from '@repo/shared-types/messages/client-api';

type Props = {
   newTrades: Trade[];
};
export function Trades({ newTrades }: Readonly<Props>) {
   return (
      <div className="flex flex-col overflow-y-hidden grow">
         {/* Desktop Layout */}
         <div className="flex-col hidden h-full px-3 sm:flex">
            {/* heading */}
            <div className="flex flex-row justify-between w-2/3">
               <p className="px-1 text-xs font-semibold text-left text-med-emphasis">
                  Price (USDC)
               </p>
               <p className="px-1 text-xs font-semibold text-left text-med-emphasis">
                  Qty (SOL)
               </p>
            </div>

            {/* data */}
            <div className="flex flex-col overflow-y-auto no-scrollbar">
               <ScrollArea className="h-[75dvh] rounded-md">
                  {newTrades.map((trade, idx) => (
                     <div
                        key={idx + 1}
                        className="flex flex-row w-full bg-transparent cursor-default hover:bg-white/4"
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
                           <p className="w-full text-sm font-normal text-right capitalize text-high-emphasis/90 tabular-nums">
                              {trade.quantity}
                           </p>
                        </div>
                        <div className="flex items-center flex-row w-[33.3%] py-1">
                           <p className="w-full text-sm font-normal text-right capitalize tabular-nums text-med-emphasis">
                              {formatTimestamp(trade.timestamp)}
                           </p>
                        </div>
                     </div>
                  ))}
               </ScrollArea>
            </div>
         </div>

         {/* Mobile Layout */}
         <div className="flex flex-col h-full px-2 sm:hidden">
            <ScrollArea className="h-[44vh] rounded-md">
               <div className="space-y-2">
                  {newTrades.map((trade, idx) => (
                     <div
                        key={idx + 1}
                        className="px-3 py-2 border rounded-lg bg-white/5 border-white/10"
                     >
                        <div className="flex items-center justify-between">
                           <span
                              className={`text-base font-semibold tabular-nums ${
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

                        <div className="flex items-center justify-between mt-1">
                           <div className="flex flex-row items-center gap-2">
                              <span className="text-xs text-med-emphasis">
                                 Qty:
                              </span>
                              <span className="text-xs text-high-emphasis/90">
                                 {trade.quantity} SOL
                              </span>
                           </div>
                           <div className="flex flex-row items-center gap-1">
                              <span className="text-xs text-med-emphasis">
                                 Side:
                              </span>
                              <span
                                 className={`text-xs font-medium ${
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
