/* eslint-disable @next/next/no-img-element */
import { formatComma, formatPrice } from '@/lib/utils';
import type { Ticker } from './utils/types';

type Props = {
   ticker?: Ticker & { change: string; name: string; imageUrl: string };
};

export default async function Ticker({ ticker }: Readonly<Props>) {
   if (!ticker) {
      return <div className="text-white">Loading...</div>;
   }
   const market = ticker.symbol.split('_');

   return (
      <div className="flex flex-row shrink-0 gap-[32px]">
         <div className="flex items-center justify-between flex-row bg-base-background-l2 cursor-pointer rounded-xl p-2 hover:opacity-90">
            <div className="flex flex-row mr-2">
               <div className="flex items-center   gap-2">
                  <div className="size-8  rounded-full overflow-hidden">
                     <img
                        src={ticker.imageUrl}
                        alt=""
                        className="object-cover w-full h-full"
                     />
                  </div>
                  <p className="font-medium text-high-emphasis text-nowrap">
                     {market[0]}
                     <span className="text-slate-500">/{market[1]}</span>
                  </p>
               </div>
            </div>
         </div>

         <div className="flex items-center flex-row flex-wrap gap-x-6">
            <div className="flex flex-col h-full justify-center">
               <p className="font-medium tabular-nums text-green-text text-lg text-green-500">
                  {formatPrice(ticker.lastPrice)}
               </p>
               <p className="text-high-emphasis text-left text-sm font-normal tabular-nums">
                  {formatPrice(ticker.lastPrice)}
               </p>
            </div>

            <div className="flex justify-center flex-col relative">
               <p className="font-medium text-gray-400 text-xs">24H Change</p>
               <span
                  className={`mt-1 text-sm leading-4 font-normal tabular-nums ${Number(ticker?.priceChange) > 0 ? 'text-green-500' : 'text-red-500'}`}
               >
                  {Number(ticker?.priceChange) > 0 ? '+' : ''}{' '}
                  {ticker?.priceChange} {Number(ticker?.change)}%
               </span>
            </div>

            <div className="flex justify-center flex-col relative">
               <p className="font-medium text-gray-400 text-xs">24H High</p>
               <span className="text-high-emphasis mt-1 text-sm leading-4 font-normal tabular-nums">
                  {formatComma(ticker.high)}
               </span>
            </div>

            <div className="flex justify-center flex-col relative">
               <p className="font-medium text-gray-400 text-xs">24H Low</p>
               <span className="text-high-emphasis mt-1 text-sm leading-4 font-normal tabular-nums">
                  {formatComma(ticker.low)}
               </span>
            </div>

            <div className="flex justify-center flex-col relative">
               <p className="font-medium text-gray-400 text-xs">
                  24H Volume ({market[0]})
               </p>
               <span className="text-high-emphasis mt-1 text-sm leading-4 font-normal tabular-nums">
                  {formatComma(ticker.volume)}
               </span>
            </div>
         </div>
      </div>
   );
}
