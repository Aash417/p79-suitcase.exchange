'use client';

import { MessageLoading } from '@/components/ui/message-loading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetUserOpenOrders } from '@/hooks';
import { authClient } from '@/lib/auth-client';
import { useParams } from 'next/navigation';

export function OpenOrders() {
   const { market } = useParams<{ market: string }>();
   const { data: session } = authClient.useSession();
   const { data, isLoading } = useGetUserOpenOrders(
      session?.user.id ?? '0',
      market // Pass market as optional parameter
   );

   if (isLoading)
      return (
         <div className="flex justify-center items-center h-[30vh] sm:h-[40vh]">
            <MessageLoading />
         </div>
      );

   return (
      <ScrollArea className="h-[44vh] rounded-xl p-2 sm:p-4">
         {/* Mobile Card Layout */}
         <div className="block space-y-2 sm:hidden 2xl:max-w-2xl 2xl:mx-auto">
            {data?.map(({ id, price, quantity, side }, idx) => (
               <div
                  key={idx + 1}
                  className="px-3 py-2 border rounded-lg bg-white/5 border-white/10"
               >
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-semibold text-white">
                        #{id.substring(0, 8)}
                     </span>
                     <span
                        className={`text-xs px-1.5 py-0.5 rounded-md ${
                           side === 'buy'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                        }`}
                     >
                        {side.toUpperCase()}
                     </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                     <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400">Qty:</span>
                        <span
                           className={`text-xs ${
                              side === 'buy' ? 'text-green-400' : 'text-red-400'
                           }`}
                        >
                           {quantity}
                        </span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400">Price:</span>
                        <span
                           className={`text-xs ${
                              side === 'buy' ? 'text-green-400' : 'text-red-400'
                           }`}
                        >
                           {price}
                        </span>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Desktop Table Layout */}
         <div className="hidden sm:block">
            <table className="w-full text-sm sm:table">
               <thead>
                  <tr className="border-b border-zinc-700">
                     <th className="px-3 py-2 text-xs font-medium text-left sm:py-4 sm:px-6 sm:text-base 2xl:text-lg text-zinc-400">
                        Order Id
                     </th>
                     <th className="px-3 py-3 text-xs font-medium text-right sm:py-4 sm:px-6 sm:text-base 2xl:text-lg text-zinc-400">
                        Quantity
                     </th>
                     <th className="px-3 py-3 text-xs font-medium text-right sm:py-4 sm:px-6 sm:text-base 2xl:text-lg text-zinc-400">
                        Price
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {data?.map(({ id, price, quantity, side }, idx) => (
                     <tr
                        key={idx + 1}
                        className={`border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors`}
                     >
                        <td className="px-3 py-3 text-xs font-medium text-white sm:py-4 sm:px-6 sm:text-sm 2xl:text-lg">
                           {id}
                        </td>
                        <td
                           className={`text-right py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm 2xl:text-lg ${
                              side === 'buy' ? 'text-green-400' : 'text-red-400'
                           }`}
                        >
                           {quantity}
                        </td>
                        <td
                           className={`text-right py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm 2xl:text-lg ${
                              side === 'buy' ? 'text-green-400' : 'text-red-400'
                           }`}
                        >
                           {price}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </ScrollArea>
   );
}
