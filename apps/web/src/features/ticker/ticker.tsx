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
      <div className="w-full h-full flex flex-row rounded-xl shadow-md overflow-hidden">
         {/* Left child: 20% width */}
         <div className="w-1/3 md:w-1/6 2xl:w-1/7 min-w-[100px] 2xl:min-w-[180px] bg-base-background-l1 flex items-center justify-center">
            <div className="flex gap-1 rounded-2xl p-2 2xl:p-3 bg-base-background-l2">
               <div className="w-full flex items-center justify-center">
                  <div className="size-6 2xl:size-10 rounded-full overflow-hidden">
                     <img
                        src={newTicker.imageUrl}
                        alt=""
                        className="object-cover w-full h-full"
                     />
                  </div>
               </div>
               <div className="w-full flex items-center justify-center text-sm 2xl:text-xl">
                  <p className="text-nowrap">
                     <span className="font-semibold">
                        {market?.split('_')[0]}
                     </span>
                     <span className="text-slate-500">
                        /{market?.split('_')[1]}{' '}
                     </span>
                  </p>
               </div>
            </div>
         </div>

         {/* Right child: 80% width */}
         <div className="w-2/3 md:w-5/6 2xl:w-6/7 relative">
            <div className="absolute inset-3 2xl:inset-6 flex items-center justify-center">
               {/* Content here fills the inner box with 1rem (xl) or 1.5rem (2xl) space from all sides */}
               <div className="w-full overflow-x-auto">
                  <div className="flex flex-row gap-4 2xl:gap-8 min-w-max">
                     <div className="flex-shrink-0 flex flex-col items-start text-xs 2xl:text-lg">
                        <p
                           className={`${isPriceUp ? 'text-green-text' : 'text-red-text'} 2xl:text-2xl`}
                        >
                           {formatPrice(newTicker?.lastPrice)}
                        </p>
                        <p className="2xl:text-xl">
                           {formatPrice(newTicker.lastPrice)}
                        </p>
                     </div>

                     <div className="flex-shrink-0 flex flex-col items-start text-xs 2xl:text-lg">
                        <p className="text-gray-400 2xl:text-xl">24H Change</p>
                        <span
                           className={`text-sm 2xl:text-xl ${
                              Number(newTicker?.priceChange) > 0
                                 ? 'text-green-500'
                                 : 'text-red-500'
                           }`}
                        >
                           {Number(newTicker?.priceChange) > 0 ? '+' : ''}
                           {newTicker?.priceChange} {Number(newTicker?.change)}%
                        </span>
                     </div>

                     <div className="flex-shrink-0 flex flex-col items-start text-xs 2xl:text-lg">
                        <p className="text-gray-400 2xl:text-xl">24H High</p>
                        <span className="text-sm 2xl:text-xl">
                           {formatComma(newTicker.high)}
                        </span>
                     </div>

                     <div className="flex-shrink-0 flex flex-col items-start text-xs 2xl:text-lg">
                        <p className="text-gray-400 2xl:text-xl">24H Low</p>
                        <span className="text-sm 2xl:text-xl">
                           {formatComma(newTicker.low)}
                        </span>
                     </div>

                     <div className="flex-shrink-0 flex flex-col items-start text-xs 2xl:text-lg">
                        <p className="text-gray-400 2xl:text-xl">
                           24H Volume ({market?.split('_')[0]})
                        </p>
                        <span className="text-sm 2xl:text-xl">
                           {formatComma(newTicker.volume)}
                        </span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
