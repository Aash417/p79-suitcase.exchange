'use client';

import { MessageLoading } from '@/components/ui/message-loading';
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
      <ScrollArea className="h-[50vh] rounded-xl p-2 sm:p-4">
         {/* Mobile Card Layout */}
         <div className="block sm:hidden space-y-4 2xl:max-w-2xl 2xl:mx-auto">
            {balances.map(([asset, balance]) => (
               <div
                  key={asset}
                  className="bg-zinc-700/30 rounded-xl p-4 border border-zinc-600/50 2xl:max-w-2xl 2xl:mx-auto"
               >
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-base font-semibold text-white">
                        {asset}
                     </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                     <div>
                        <div className="text-zinc-400 mb-1">Available</div>
                        <div className="text-zinc-300 font-medium">
                           {(balance.available / 100).toLocaleString()}
                        </div>
                     </div>
                     <div>
                        <div className="text-zinc-400 mb-1">Locked</div>
                        <div className="text-zinc-300 font-medium">
                           {(balance.locked / 100).toLocaleString()}
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
                     <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-base font-medium text-zinc-400">
                        Asset
                     </th>
                     <th className="text-right py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-base font-medium text-zinc-400">
                        Available
                     </th>
                     <th className="text-right py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-base font-medium text-zinc-400">
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
                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-white">
                           {asset}
                        </td>
                        <td className="text-right py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-zinc-300">
                           {(balance.available / 100).toLocaleString()}
                        </td>
                        <td className="text-right py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-zinc-300">
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
