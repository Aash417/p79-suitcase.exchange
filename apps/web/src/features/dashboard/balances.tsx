'use client';

import { MessageLoading } from '@/components/ui/message-loading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetUserBalances } from '@/hooks';
import { authClient } from '@/lib/auth-client';

export function Balances() {
   const { data: session } = authClient.useSession();
   const { data, isLoading } = useGetUserBalances(session?.user.id ?? '0');

   let balances: [string, { available: number; locked: number }][] = [];
   if (data) {
      balances = Object.entries(data).map(([asset, balance]) => [
         asset,
         {
            available:
               typeof balance.available === 'string'
                  ? Number(balance.available)
                  : balance.available,
            locked:
               typeof balance.locked === 'string'
                  ? Number(balance.locked)
                  : balance.locked
         }
      ]);
   }

   if (isLoading)
      return (
         <div className="flex justify-center items-center h-[30vh] sm:h-[40vh]">
            <MessageLoading />
         </div>
      );

   return (
      <ScrollArea className="h-[45vh] rounded-xl p-2 sm:p-4">
         {/* Mobile Card Layout */}
         <div className="block space-y-2 sm:hidden 2xl:max-w-2xl 2xl:mx-auto">
            {balances.map(([asset, balance]) => (
               <div
                  key={asset}
                  className="px-3 py-2 border rounded-lg bg-white/5 border-white/10"
               >
                  <div className="flex items-center justify-between">
                     <span className="text-base font-semibold text-white">
                        {asset}
                     </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                     <div className="flex flex-row items-center gap-2">
                        <span className="text-xs text-zinc-400">
                           Available:
                        </span>
                        <span className="text-xs text-zinc-300">
                           {(balance.available / 100).toLocaleString()}
                        </span>
                     </div>
                     <div className="flex flex-row items-center gap-2">
                        <span className="text-xs text-zinc-400">Locked:</span>
                        <span className="text-xs text-zinc-300">
                           {(balance.locked / 100).toLocaleString()}
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
                     <th className="px-3 py-3 text-xs font-medium text-left sm:py-4 sm:px-6 sm:text-base text-zinc-400">
                        Asset
                     </th>
                     <th className="px-3 py-3 text-xs font-medium text-right sm:py-4 sm:px-6 sm:text-base text-zinc-400">
                        Available
                     </th>
                     <th className="px-3 py-3 text-xs font-medium text-right sm:py-4 sm:px-6 sm:text-base text-zinc-400">
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
                        <td className="px-3 py-3 text-xs font-medium text-white sm:py-4 sm:px-6 sm:text-sm">
                           {asset}
                        </td>
                        <td className="px-3 py-3 text-xs text-right sm:py-4 sm:px-6 sm:text-sm text-zinc-300">
                           {(balance.available / 100).toLocaleString()}
                        </td>
                        <td className="px-3 py-3 text-xs text-right sm:py-4 sm:px-6 sm:text-sm text-zinc-300">
                           {(balance.locked / 100).toLocaleString()}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </ScrollArea>
   );
}
