import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dashboard } from '@/features/dashboard/dashboard';
import { KlineChart } from '@/features/klineChart/klineChart';
import { DepositForm } from '@/features/onRampUI/deposit-form';
import { Orderbook } from '@/features/orderbook/orderbook';
import { SwapForm } from '@/features/swapUI/swap-form';
import { Ticker } from '@/features/ticker/ticker';
import { Trades } from '@/features/trades/trades';

export function MarketsTrades() {
   return (
      <div className="bg-base-background-l0 text-high-emphasis flex flex-1 flex-col overflow-auto">
         <div className="flex flex-col flex-1">
            <div className="flex flex-row mb-4 h-screen flex-1 gap-2 overflow-hidden px-4">
               {/* left */}
               <div className="flex flex-col flex-1 gap-2">
                  {/* upper dashboard */}
                  <div className="flex flex-col gap-2">
                     {/* ticker */}
                     <div className="flex items-center flex-row bg-base-background-l1 relative w-full rounded-lg">
                        <div className="flex items-center flex-row no-scrollbar mr-4 h-[72px] w-full overflow-auto pl-4">
                           <div className="flex justify-between flex-row w-full gap-4">
                              <Ticker />
                           </div>
                        </div>
                     </div>

                     {/* ui */}
                     <div className="flex flex-col">
                        <div className="flex flex-row relative gap-2">
                           {/* chart */}
                           <div className="flex flex-col bg-base-background-l1 flex-1 overflow-hidden rounded-lg">
                              <div className="tradingview-chart">
                                 <KlineChart />
                              </div>
                           </div>

                           {/* orderbook & Trades */}
                           <div className="flex flex-col bg-base-background-l1 w-1/3 max-w-[300px] min-w-[260px] overflow-hidden rounded-lg">
                              <div className="flex flex-col h-full">
                                 <Tabs defaultValue="book">
                                    <TabsList className="flex gap-2 mx-6 my-3 w-1/3 rounded-lg p-1">
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
                                       <div className="flex flex-col grow overflow-y-hidden">
                                          <Orderbook />
                                       </div>
                                    </TabsContent>

                                    <TabsContent value="trades">
                                       <div className="flex flex-col grow overflow-y-hidden">
                                          <Trades />
                                       </div>
                                    </TabsContent>
                                 </Tabs>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* lower dashboard */}
                  <div className="flex flex-col min-h-[50vh]">
                     <div className="flex flex-col bg-base-background-l1 relative overflow-hidden rounded-lg">
                        <Dashboard />
                     </div>
                  </div>
               </div>

               {/* right */}
               <div className="flex flex-col gap-2">
                  <div className="flex flex-col bg-base-background-l1 w-[332px] gap-4 rounded-lg px-[16px] py-[16px]">
                     <div className="basis-[28vw] bg-base-background-l1 rounded-md">
                        <SwapForm />
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
