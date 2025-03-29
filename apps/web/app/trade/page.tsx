import MarketBar from '../components/MarketBar';

export default function Market() {
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
                     <MarketBar />
                  </div>

                  {/* Bottom row with columns */}
                  <div className="col-span-2 bg-green-300 h-full rounded-md">
                     four
                  </div>
                  <div className="bg-red-700 h-full rounded-md">five</div>
               </div>
            </div>

            {/* Right panel */}
            <div className="basis-[28vw] bg-cyan-500 rounded-md">two</div>
         </div>
      </div>
   );
}
