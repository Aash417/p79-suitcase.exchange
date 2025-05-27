'use client';

import { MessageLoading } from '@/components/ui/message-loading';
import { useGetUserOpenOrders } from '@/hooks';
import { authClient } from '@/lib/auth-client';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useParams } from 'next/navigation';

export function OpenOrders() {
   const { market } = useParams<{ market: string }>();
   const { data: session } = authClient.useSession();
   const { data, isLoading, error } = useGetUserOpenOrders(
      market,
      session?.user.id ?? '0'
   );

   if (isLoading)
      return (
         <div className="flex justify-center items-center h-[40vh]">
            <MessageLoading />
         </div>
      );

   return (
      <div
         className={`w-full ${error ? 'opacity-50 pointer-events-none' : ''}`}
      >
         <ScrollArea className="h-72 rounded-md ">
            <table className="w-full">
               <thead>
                  <tr className="border-b border-zinc-700">
                     <th className="text-left py-4 px-6 text-sm font-medium text-zinc-400">
                        Order Id
                     </th>
                     <th className="text-right py-4 px-6 text-sm font-medium text-zinc-400">
                        Quantity
                     </th>
                     <th className="text-right py-4 px-6 text-sm font-medium text-zinc-400">
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
                        <td className="py-4 px-6 text-sm font-medium text-white ">
                           {id}
                        </td>
                        <td
                           className={`text-right py-4 px-6 text-sm ${
                              side === 'buy' ? 'text-green-400' : 'text-red-400'
                           }`}
                        >
                           {quantity}
                        </td>
                        <td
                           className={`text-right py-4 px-6 text-sm ${
                              side === 'buy' ? 'text-green-400' : 'text-red-400'
                           }`}
                        >
                           {price}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </ScrollArea>
      </div>
   );
}
