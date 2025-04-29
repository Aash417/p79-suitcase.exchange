import Appbar from '@/components/appbar';
import KlineChart from '@/features/klineChart/klineChart';
import DepositForm from '@/features/onRampUI/depositForm';
import Orderbook from '@/features/orderbook/orderbook';
import SwapForm from '@/features/swapUI/swapForm';
import Ticker from '@/features/ticker/ticker';
import { getDepth, getKlines, getTicker } from '@/lib/httpClients';

export default async function Market({
   params,
}: Readonly<{ params: Promise<{ market: string }> }>) {
   const { market } = await params;
   const kline = await getKlines(market);
   const depthData = await getDepth(market);
   const ticker = await getTicker(market);
   // const balance = await getUserBalances();

   const balance = {
      USDC: {
         available: 999900000,
         locked: 100000,
      },
      SOL: {
         available: 50000,
         locked: 0,
      },
      PEPE: {
         available: 50000,
         locked: 0,
      },
      BTC: {
         available: 50000,
         locked: 0,
      },
   };

   const depth = {
      ...depthData,
      bids: [...depthData.bids].reverse(), // Highest first
      asks: [...depthData.asks], // Lowest first (already sorted)
   };

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
                        <Orderbook
                           market={market}
                           depthData={depth}
                           lastTradedPrice={ticker?.lastPrice}
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* Right panel */}
            <div className="h-full flex flex-col gap-2">
               <div className="basis-[28vw] bg-[#14151b] rounded-md">
                  <SwapForm market={market} balance={balance} />
               </div>
               <div className="basis-[28vw] bg-[#14151b] rounded-md">
                  <DepositForm />
               </div>
            </div>
         </div>
      </div>
   );
}
