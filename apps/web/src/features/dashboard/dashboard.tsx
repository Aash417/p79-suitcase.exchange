import { API_URL } from '@/lib/env';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Balances } from './balances';
import { OpenOrders } from './open-orders';

export function Dashboard() {
   return (
      <div
         className={`w-full max-w-screen-xl mx-auto p-2 sm:p-4 ${
            API_URL === 'https://api.backpack.exchange/api/v1'
               ? 'opacity-40 pointer-events-none'
               : ''
         }`}
      >
         <Tabs defaultValue="balances" className="w-full">
            <TabsList className="flex mb-4 sm:mb-6 w-full sm:w-1/2 lg:w-1/3 rounded-lg p-1">
               <TabsTrigger
                  value="balances"
                  className="flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-md data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400 transition-all"
               >
                  Balances
               </TabsTrigger>
               <TabsTrigger
                  value="open-orders"
                  className="flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-md data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400 transition-all"
               >
                  Open Orders
               </TabsTrigger>
            </TabsList>

            <TabsContent
               value="balances"
               className="bg-zinc-800/50 rounded-lg p-3 sm:p-6 h-[40vh] sm:h-[50vh] overflow-hidden"
            >
               <div className="space-y-4 h-full">
                  <Balances />
               </div>
            </TabsContent>

            <TabsContent
               value="open-orders"
               className="bg-zinc-800/50 rounded-lg p-3 sm:p-6 h-[40vh] sm:h-[50vh] overflow-hidden"
            >
               <div className="space-y-4 h-full">
                  <OpenOrders />
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
}
