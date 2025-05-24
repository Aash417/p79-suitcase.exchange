import { API_URL } from '@/lib/env';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Balances } from './balances';
import { OpenOrders } from './open-orders';

export function Dashboard() {
   return (
      <div
         className={`w-full max-w-screen-xl mx-auto p-4 ${
            API_URL === 'https://api.backpack.exchange/api/v1'
               ? 'opacity-40 pointer-events-none'
               : ''
         }`}
      >
         <Tabs defaultValue="balances" className="w-full">
            <TabsList className="flex mb-6 w-1/3  rounded-lg p-1">
               <TabsTrigger
                  value="balances"
                  className="flex-1 px-4 py-2 text-sm rounded-md data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400 transition-all"
               >
                  Balances
               </TabsTrigger>
               <TabsTrigger
                  value="open-orders"
                  className="flex-1 px-4 py-2 text-sm rounded-md data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400 transition-all"
               >
                  Open Orders
               </TabsTrigger>
            </TabsList>

            <TabsContent
               value="balances"
               className="bg-zinc-800/50 rounded-lg p-6 h-[50vh]"
            >
               <div className="space-y-4">
                  <Balances />
               </div>
            </TabsContent>

            <TabsContent
               value="open-orders"
               className="bg-zinc-800/50 rounded-lg p-6 h-[50vh]"
            >
               <div className="space-y-4">
                  <OpenOrders />
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
}
