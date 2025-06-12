import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Orderbook } from '@/features/orderbook/orderbook';
import { Trades } from '@/features/trades/trades';
import { Trade } from '@repo/shared-types/messages/client-api';

type Props = {
   topAsks: [string, string][];
   topBids: [string, string][];
   isPriceUp: boolean;
   lastPrice?: string;
   loadingDepth?: boolean;
   loadingTrades?: boolean;
   newTrades?: Trade[];
};

export function OrderBookAndTrades(props: Readonly<Props>) {
   const {
      topAsks,
      topBids,
      isPriceUp,
      lastPrice,
      loadingDepth = false,
      loadingTrades = false,
      newTrades = []
   } = props;

   return (
      <Tabs defaultValue="book" className="w-full h-full flex flex-col mt-1">
         <TabsList className="flex gap-2 mx-6 w-1/3 rounded-lg">
            <TabsTrigger
               value="book"
               className="text-sm rounded-md data-[state=active]:bg-zinc-700/30 data-[state=active]:text-white text-zinc-400"
            >
               Book
            </TabsTrigger>
            <TabsTrigger
               value="trades"
               className="text-sm rounded-md data-[state=active]:bg-zinc-700/30 data-[state=active]:text-white text-zinc-400"
            >
               Trades
            </TabsTrigger>
         </TabsList>

         <TabsContent value="book">
            {loadingDepth ? (
               <div className=""></div>
            ) : (
               <Orderbook
                  topAsks={topAsks}
                  topBids={topBids}
                  isPriceUp={isPriceUp}
                  lastPrice={lastPrice ?? '0.00'}
               />
            )}
         </TabsContent>

         <TabsContent value="trades">
            {loadingTrades ? (
               <div className=""></div>
            ) : (
               <div className="flex flex-col grow h-full min-h-0">
                  <div className="flex flex-col grow overflow-y-auto min-h-0">
                     <Trades newTrades={newTrades} />
                  </div>
               </div>
            )}
         </TabsContent>
      </Tabs>
   );
}
