/* eslint-disable @next/next/no-img-element */
'use client';

import { formatComma, formatPrice } from '@/lib/utils';
import { useParams } from 'next/navigation';

type Props = {
   newTicker: { [key: string]: string };
   isPriceUp: boolean;
};
export function Ticker({ newTicker, isPriceUp }: Readonly<Props>) {
   const market = useParams<{ market: string }>().market || '';

   return (
      <div className="flex flex-row shrink-0 gap-[32px]">
         <div className="flex items-center justify-between flex-row bg-base-background-l2 rounded-xl p-2 hover:opacity-90">
            <div className="flex flex-row mr-2">
               <div className="flex items-center   gap-2">
                  <div className="size-8  rounded-full overflow-hidden">
                     <img
                        src={newTicker.imageUrl}
                        alt=""
                        className="object-cover w-full h-full"
                     />
                  </div>
                  <p className="font-medium text-high-emphasis text-nowrap">
                     {market?.split('_')[0]}
                     <span className="text-slate-500">
                        /{market?.split('_')[1]}
                     </span>
                  </p>
               </div>
            </div>
         </div>

         <div className="flex items-center flex-row flex-wrap gap-x-6">
            <div className="flex flex-col h-full justify-center">
               <PriceDisplay price={newTicker.lastPrice} isUp={isPriceUp} />
               <p className="text-high-emphasis text-left text-sm font-normal tabular-nums">
                  {formatPrice(newTicker.lastPrice)}
               </p>
            </div>

            <div className="flex justify-center flex-col relative">
               <p className="font-medium text-gray-400 text-xs">24H Change</p>
               <span
                  className={`mt-1 text-sm leading-4 font-normal tabular-nums ${
                     Number(newTicker?.priceChange) > 0
                        ? 'text-green-500'
                        : 'text-red-500'
                  }`}
               >
                  {Number(newTicker?.priceChange) > 0 ? '+' : ''}{' '}
                  {newTicker?.priceChange} {Number(newTicker?.change)}%
               </span>
            </div>

            <div className="flex justify-center flex-col relative">
               <p className="font-medium text-gray-400 text-xs">24H High</p>
               <span className="text-high-emphasis mt-1 text-sm leading-4 font-normal tabular-nums">
                  {formatComma(newTicker.high)}
               </span>
            </div>

            <div className="flex justify-center flex-col relative">
               <p className="font-medium text-gray-400 text-xs">24H Low</p>
               <span className="text-high-emphasis mt-1 text-sm leading-4 font-normal tabular-nums">
                  {formatComma(newTicker.low)}
               </span>
            </div>

            <div className="flex justify-center flex-col relative">
               <p className="font-medium text-gray-400 text-xs">
                  24H Volume ({market?.split('_')[1]})
               </p>
               <span className="text-high-emphasis mt-1 text-sm leading-4 font-normal tabular-nums">
                  {formatComma(newTicker.volume)}
               </span>
            </div>
         </div>
      </div>
   );
}

function PriceDisplay({
   price,
   isUp
}: Readonly<{ price: string; isUp: boolean }>) {
   return (
      <p
         className={`font-medium tabular-nums ${
            isUp ? 'text-green-text' : 'text-red-text'
         } text-lg`}
      >
         {formatPrice(price)}
      </p>
   );
}
