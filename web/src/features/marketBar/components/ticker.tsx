export function MarketTicker({ market }: Readonly<{ market: string }>) {
   return (
      <div className="flex h-[60px] shrink-0 space-x-2">
         <div className="flex flex-row relative ml-2 -mr-4">
            {/* <img
               alt="USDC Logo"
               loading="lazy"
               decoding="async"
               data-nimg="1"
               className="h-6 w-6 -ml-2 mt-4 rounded-full"
               src="/usdc.webp"
            /> */}
         </div>
         <button type="button" className="react-aria-Button" data-rac="">
            <div className="flex items-center justify-between flex-row cursor-pointer rounded-lg p-3 hover:opacity-80">
               <div className="flex items-center flex-row gap-2 undefined">
                  <div className="flex flex-row relative">
                     <p className="font-medium text-md undefined">
                        {market.replace('_', ' / ')}
                     </p>
                  </div>
               </div>
            </div>
         </button>
      </div>
   );
}
