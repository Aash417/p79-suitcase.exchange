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
      market,
      session?.user.id ?? '0'
   );

   if (isLoading)
      return (
         <div className="flex justify-center items-center h-[30vh] sm:h-[40vh]">
            <MessageLoading />
         </div>
      );

   return (
      <ScrollArea className="h-[50vh] rounded-xl p-2 sm:p-4">
         {/* Mobile Card Layout */}
         <div className="block sm:hidden space-y-4 2xl:max-w-2xl 2xl:mx-auto">
            {data?.map(({ id, price, quantity, side }, idx) => (
               <div
                  key={idx + 1}
                  className="bg-zinc-700/30 rounded-xl p-4 border border-zinc-600/50 2xl:max-w-2xl 2xl:mx-auto"
               >
                  <div className="flex justify-between items-center mb-3">
                     <span className="text-base font-semibold text-white">
                        Order #{id}
                     </span>
                     <span
                        className={`text-xs px-2 py-1 rounded-lg ${
                           side === 'buy'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                        }`}
                     >
                        {side.toUpperCase()}
                     </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                     <div>
                        <div className="text-zinc-400 mb-1">Quantity</div>
                        <div
                           className={`font-medium ${
                              side === 'buy' ? 'text-green-400' : 'text-red-400'
                           }`}
                        >
                           {quantity}
                        </div>
                     </div>
                     <div>
                        <div className="text-zinc-400 mb-1">Price</div>
                        <div
                           className={`font-medium ${
                              side === 'buy' ? 'text-green-400' : 'text-red-400'
                           }`}
                        >
                           {price}
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Desktop Table Layout */}
         <div className="hidden sm:block">
            <table className="w-full sm:table text-sm">
               <thead>
                  <tr className="border-b border-zinc-700">
                     <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-base 2xl:text-lg font-medium text-zinc-400">
                        Order Id
                     </th>
                     <th className="text-right py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-base 2xl:text-lg font-medium text-zinc-400">
                        Quantity
                     </th>
                     <th className="text-right py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-base 2xl:text-lg font-medium text-zinc-400">
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
                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm 2xl:text-lg font-medium text-white">
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
