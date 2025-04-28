import Appbar from '@/components/appbar';
import KlineChart from '@/features/klineChart/klineChart';
import Orderbook from '@/features/orderbook/orderbook';
import SwapForm from '@/features/swapUI/swapForm';
import Ticker from '@/features/ticker/ticker';
import { getDepth, getKlines, getTicker } from '@/lib/httpClients';

export default async function Market({
   params,
}: Readonly<{ params: Promise<{ market: string }> }>) {
   const { market } = await params;
   const kline = await getKlines(market);
   const depth = await getDepth(market);
   const ticker = await getTicker(market);

   return (
      <div className="h-screen w-full rounded-md m-2">
         {/* Header */}
         <div className="h-10 w-[calc(100%-1rem)]  mb-2 rounded-md">
            <Appbar />
         </div>

         {/* Main content (subtract header height) */}
         <div className="flex gap-2 h-[calc(100%-4.2rem)] w-[calc(100%-1rem)]">
            {/* Left panel */}
            <div className="basis-[72vw] flex-1">
               <div className="grid grid-rows-[auto_1fr] h-full gap-2">
                  {/* Top row */}
                  <div className="col-span-3 h-15 bg-[#14151b]  rounded-md">
                     <Ticker ticker={ticker} />
                  </div>

                  {/* Bottom row with columns */}
                  <div className="col-span-2 py-6 bg-[#14151b] h-full rounded-md">
                     <KlineChart market={market} klineData={kline} />
                  </div>
                  <div className="bg-[#14151b] h-full rounded-md">
                     <div className="w-55">
                        <Orderbook market={market} depthData={depth} />
                     </div>
                  </div>
               </div>
            </div>

            {/* Right panel */}
            <div className="basis-[28vw] bg-[#14151b] rounded-md">
               <SwapForm market={market} />
            </div>
         </div>
      </div>
   );
}
