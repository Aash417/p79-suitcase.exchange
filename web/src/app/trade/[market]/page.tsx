import KlineChart from '@/features/klineChart/klineChart';
import DepositForm from '@/features/onRampUI/deposit-form';
import Orderbook from '@/features/orderbook/orderbook';
import SwapForm from '@/features/swapUI/swap-form';
import Ticker from '@/features/ticker/ticker';
import { getDepth, getKlines, getTicker } from '@/lib/http-clients';

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
      <div className="bg-base-background-l0 text-high-emphasis flex flex-1 flex-col overflow-auto">
         <div className="flex flex-col flex-1">
            <div className="flex flex-row mb-4 h-screen flex-1 gap-2 overflow-hidden px-4">
               {/* left */}
               <div className="flex flex-col flex-1">
                  {/* upper dashboard */}
                  <div className="flex flex-col gap-2">
                     {/* ticker */}
                     <div className="flex items-center flex-row bg-base-background-l1 relative w-full rounded-lg">
                        <div className="flex items-center flex-row no-scrollbar mr-4 h-[72px] w-full overflow-auto pl-4">
                           <div className="flex justify-between flex-row w-full gap-4">
                              <Ticker ticker={ticker} />
                           </div>
                        </div>
                     </div>

                     {/* ui */}
                     <div className="flex flex-col">
                        <div className="flex flex-row relative gap-2">
                           {/* chart */}
                           <div className="flex flex-col bg-base-background-l1 flex-1 overflow-hidden rounded-lg">
                              <div className="tradingview-chart">
                                 <KlineChart
                                    market={market}
                                    klineData={kline}
                                 />
                              </div>
                           </div>

                           {/* orderbook */}
                           <div className="flex flex-col bg-base-background-l1 w-1/3 max-w-[300px] min-w-[260px] overflow-hidden rounded-lg">
                              <div className="flex flex-col h-full">
                                 <div className="px-4 py-4">Book</div>

                                 <div className="flex flex-col grow overflow-y-hidden">
                                    <Orderbook
                                       market={market}
                                       depthData={depth}
                                       lastTradePrice={ticker?.lastPrice}
                                    />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* lower dashboard */}
                  <div className="flex flex-col"></div>
               </div>

               {/* right */}
               <div className="flex flex-col gap-2">
                  <div className="flex flex-col bg-base-background-l1 w-[332px] gap-4 rounded-lg px-[16px] py-[16px]">
                     <div className="basis-[28vw] bg-base-background-l1 rounded-md">
                        <SwapForm market={market} balance={balance} />
                     </div>
                  </div>

                  <div className="flex flex-col bg-base-background-l1 w-[332px] gap-4 rounded-lg px-[16px] py-[16px]">
                     <div className="basis-[15vw] bg-base-background-l1 rounded-md">
                        <DepositForm />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
