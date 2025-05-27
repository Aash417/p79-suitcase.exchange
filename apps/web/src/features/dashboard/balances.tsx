'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetUserBalances } from '@/hooks';
import { authClient } from '@/lib/auth-client';

export function Balances() {
   const { data: session } = authClient.useSession();
   const { data, isLoading, error } = useGetUserBalances(
      session?.user.id ?? '0'
   );

   let balances: [string, { available: number; locked: number }][] = [];
   if (data) {
      balances = Object.entries(data);
   }

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
                        Asset
                     </th>
                     <th className="text-right py-4 px-6 text-sm font-medium text-zinc-400">
                        Available
                     </th>
                     <th className="text-right py-4 px-6 text-sm font-medium text-zinc-400">
                        Locked
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {balances.map(([asset, balance]) => (
                     <tr
                        key={asset}
                        className={`border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors`}
                     >
                        <td className="py-4 px-6 text-sm font-medium text-white">
                           {asset}
                        </td>
                        <td className="text-right py-4 px-6 text-sm text-zinc-300">
                           {(balance.available / 100).toLocaleString()}
                        </td>
                        <td className="text-right py-4 px-6 text-sm text-zinc-300">
                           {(balance.locked / 100).toLocaleString()}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </ScrollArea>
      </div>
   );
}
