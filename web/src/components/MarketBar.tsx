import { Ticker } from '@/lib/types';
import { MarketTicker } from './ticker';

type Props = {
   market: string;
};

export default async function MarketBar({ market }: Readonly<Props>) {
   const tic = await fetch('https://api.backpack.exchange/api/v1/tickers');

   const res = await tic.json();
   const ticker = res.find((t: Ticker) => t.symbol === market);

   return (
      <div className="flex items-center justify-between flex-row no-scrollbar overflow-auto pr-4">
         <MarketTicker market={market} />

         <div className="flex items-center flex-row space-x-8 pl-4">
            <div className="flex flex-col h-full justify-center">
               <p
                  className={`font-medium tabular-nums text-greenText text-md text-green-500`}
               >
                  ${ticker?.lastPrice}
               </p>
               <p className="font-medium text-sm tabular-nums">
                  ${ticker?.lastPrice}
               </p>
            </div>
            <div className="flex flex-col">
               <p className={`font-medium  text-slate-400 text-sm`}>
                  24H Change
               </p>
               <p
                  className={` font-medium tabular-nums leading-5 text-sm text-greenText ${Number(ticker?.priceChange) > 0 ? 'text-green-500' : 'text-red-500'}`}
               >
                  {Number(ticker?.priceChange) > 0 ? '+' : ''}{' '}
                  {ticker?.priceChange}{' '}
                  {Number(ticker?.priceChangePercent)?.toFixed(2)}%
               </p>
            </div>
            <div className="flex flex-col">
               <p className="font-medium text-sm text-slate-400 ">24H High</p>
               <p className="font-medium tabular-nums leading-5 text-sm ">
                  {ticker?.high}
               </p>
            </div>
            <div className="flex flex-col">
               <p className="font-medium text-slate-400 text-sm">24H Low</p>
               <p className="font-medium tabular-nums leading-5 text-sm ">
                  {ticker?.low}
               </p>
            </div>
            <button
               type="button"
               className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer text-base text-left"
               data-rac=""
            >
               <div className="flex flex-col">
                  <p className="font-medium  text-slate-400 text-sm">
                     24H Volume
                  </p>
                  <p className="mt-1  font-medium tabular-nums leading-5 text-sm ">
                     {ticker?.volume}
                  </p>
               </div>
            </button>
         </div>
      </div>
   );
}
