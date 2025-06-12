import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { API_URL } from '@/lib/env';
import { Balances } from './balances';
import { OpenOrders } from './open-orders';

export function Dashboard() {
   return (
      <div
         className={`w-full h-full flex flex-col p-2 xl:p-6 2xl:p-8 ${
            API_URL === 'https://api.backpack.exchange/api/v1'
               ? 'opacity-40 pointer-events-none'
               : ''
         }`}
      >
         <Tabs defaultValue="balances" className="w-full h-full flex flex-col">
            <TabsList className="">
               <TabsTrigger
                  value="balances"
                  className="text-sm rounded-md px-4 py-2 2xl:py-6 2xl:px-4 2xl:text-xl data-[state=active]:bg-zinc-700/30 data-[state=active]:text-white text-zinc-400 transition-all cursor-pointer"
               >
                  Balances
               </TabsTrigger>
               <TabsTrigger
                  value="open-orders"
                  className="text-sm rounded-md px-4 py-2 2xl:py-6 2xl:px-4 2xl:text-xl data-[state=active]:bg-zinc-700/30 data-[state=active]:text-white text-zinc-400 transition-all cursor-pointer"
               >
                  Open Orders
               </TabsTrigger>
            </TabsList>

            <TabsContent value="balances">
               <Balances />
            </TabsContent>

            <TabsContent value="open-orders">
               <OpenOrders />
            </TabsContent>
         </Tabs>
      </div>
   );
}
