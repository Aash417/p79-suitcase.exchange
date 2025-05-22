'use client';

import { useGetUserOpenOrders } from '@/hooks';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useParams } from 'next/navigation';

export default function OpenOrders() {
   const { market } = useParams<{ market: string }>();
   const { data, isLoading, error } = useGetUserOpenOrders(market);

   if (isLoading)
      return (
         <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-400"></div>
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
