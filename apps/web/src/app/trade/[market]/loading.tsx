export default function Loading() {
   return (
      <div className="min-h-screen p-1 px-2 bg-base-background-l0 animate-pulse">
         {/* Desktop layout: Chart and side panels */}
         <div className="flex-row hidden w-full gap-2 px-2 lg:flex bg-base-background-l0">
            <div className="flex flex-col w-3/4 gap-2">
               {/* Ticker skeleton (10% vh) */}
               <div className="h-[10vh] bg-base-background-l1 rounded-sm"></div>
               {/* Chart and orderbook panel skeletons */}
               <div className="flex flex-row gap-2 h-[90vh] w-full">
                  <div className="w-2/3 rounded-sm bg-base-background-l1"></div>
                  <div className="w-1/3 rounded-sm bg-base-background-l1"></div>
               </div>
            </div>
            <div className="flex flex-col w-1/4 gap-2">
               <div className="h-[60vh] bg-base-background-l1 rounded-sm"></div>
               <div className="h-[35vh] bg-base-background-l1 rounded-sm"></div>
            </div>
         </div>

         {/* Mobile layout: stacked blocks */}
         <div className="flex flex-col gap-4 p-2 lg:hidden">
            <div className="h-[72px] bg-base-background-l1 rounded"></div>
            <div className="h-[300px] bg-base-background-l1 rounded"></div>
            <div className="h-20 rounded bg-base-background-l1"></div>
            <div className="h-20 rounded bg-base-background-l1"></div>
         </div>
      </div>
   );
}
