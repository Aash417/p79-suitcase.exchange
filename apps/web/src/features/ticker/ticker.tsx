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
      <div className="w-full h-full px-2 py-2 lg:px-3 lg:py-2 2xl:px-8 2xl:py-6 flex items-center rounded-xl shadow-md">
         <div className="flex flex-row gap-9 w-full items-center flex-wrap">
            <div className="flex items-center flex-row gap-2 min-w-[100px] lg:min-w-[90px] 2xl:min-w-[120px] bg-base-background-l2 rounded-xl px-3 py-2 2xl:px-4 2xl:py-3 cursor-pointer hover:opacity-90 transition-all shadow-sm">
               <div className="size-6 2xl:size-10 rounded-full overflow-hidden">
                  <img
                     src={newTicker.imageUrl}
                     alt=""
                     className="object-cover w-full h-full"
                  />
               </div>
               <p className="text-high-emphasis text-base 2xl:text-xl text-nowrap">
                  <span className="font-semibold">{market?.split('_')[0]}</span>
                  <span className="text-slate-500">
                     /{market?.split('_')[1]}{' '}
                  </span>
               </p>
            </div>

            <div className="flex items-center flex-row flex-wrap gap-x-6 gap-y-2">
               <div className="flex flex-col h-full justify-center min-w-[80px] lg:min-w-[90px] 2xl:min-w-[100px]">
                  <p
                     className={`font-medium tabular-nums ${
                        isPriceUp ? 'text-green-text' : 'text-red-text'
                     } text-lg  2xl:text-2xl`}
                  >
                     {formatPrice(newTicker?.lastPrice)}
                  </p>
                  <p className="text-high-emphasis text-left text-base 2xl:text-2xl font-normal tabular-nums">
                     {formatPrice(newTicker.lastPrice)}
                  </p>
               </div>

               <div className="flex flex-col items-start min-w-[70px] lg:min-w-[80px] 2xl:min-w-[90px]">
                  <p className="font-medium text-gray-400 text-xs 2xl:text-[17px]">
                     24H Change
                  </p>
                  <span
                     className={`mt-1 text-base 2xl:text-xl leading-4 font-normal tabular-nums ${
                        Number(newTicker?.priceChange) > 0
                           ? 'text-green-500'
                           : 'text-red-500'
                     }`}
                  >
                     {Number(newTicker?.priceChange) > 0 ? '+' : ''}{' '}
                     {newTicker?.priceChange} {Number(newTicker?.change)}%
                  </span>
               </div>

               <div className="flex flex-col items-start min-w-[70px] lg:min-w-[80px] 2xl:min-w-[90px]">
                  <p className="font-medium text-gray-400 text-xs 2xl:text-[17px]">
                     24H High
                  </p>
                  <span className="text-high-emphasis mt-1 text-base 2xl:text-xl leading-4 font-normal tabular-nums">
                     {formatComma(newTicker.high)}
                  </span>
               </div>

               <div className="flex flex-col items-start min-w-[70px] lg:min-w-[80px] 2xl:min-w-[90px]">
                  <p className="font-medium text-gray-400 text-xs 2xl:text-[17px]">
                     24H Low
                  </p>
                  <span className="text-high-emphasis mt-1 text-base 2xl:text-xl leading-4 font-normal tabular-nums">
                     {formatComma(newTicker.low)}
                  </span>
               </div>

               <div className="flex flex-col items-start min-w-[90px] lg:min-w-[100px] 2xl:min-w-[120px]">
                  <p className="font-medium text-gray-400 text-xs 2xl:text-[17px]">
                     24H Volume ({market?.split('_')[1]})
                  </p>
                  <span className="text-high-emphasis mt-1 text-base 2xl:text-xl leading-4 font-normal tabular-nums">
                     {formatComma(newTicker.volume)}
                  </span>
               </div>
            </div>
         </div>
      </div>
   );
}
