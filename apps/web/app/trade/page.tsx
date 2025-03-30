import KlineChart from '../components/klineChart';
import MarketBar from '../components/MarketBar';
import Orderbook from '../components/orderbook';
import { SYMBOLS } from '../utils/constants';
import { getDepth, getKlines } from '../utils/httpClients';

export default async function Market() {
   const market = SYMBOLS[11]!; // 'ETH_USDC'
   const klineData = await getKlines(market);
   const depthdata = await getDepth(market);

   return (
      <div className="h-screen w-full rounded-md m-2">
         {/* Header */}
         <div className="h-10 w-[calc(100%-1rem)] bg-fuchsia-700 mb-2 rounded-md"></div>

         {/* Main content (subtract header height) */}
         <div className="flex gap-2 h-[calc(100%-4.2rem)] w-[calc(100%-1rem)]">
            {/* Left side */}
            <div className="basis-[72vw] flex-1">
               <div className="grid grid-rows-[auto_1fr] h-full gap-2">
                  {/* Top row */}
                  <div className="col-span-3 h-15 bg-[#14151b]  rounded-md">
                     <MarketBar market={market} />
                  </div>

                  {/* Bottom row with columns */}
                  <div className="col-span-2 bg-[#14151b] h-full rounded-md">
                     <KlineChart market={market} klineData={klineData} />
                  </div>
                  <div className="bg-[#14151b] h-full rounded-md">
                     <div className="w-55">
                        <Orderbook market={market} depthdata={depthdata} />
                     </div>
                  </div>
               </div>
            </div>

            {/* Right panel */}
            <div className="basis-[28vw] bg-cyan-500 rounded-md">two</div>
         </div>
      </div>
   );
}
