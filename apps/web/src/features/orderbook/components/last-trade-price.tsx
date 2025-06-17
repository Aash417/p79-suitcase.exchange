'use client';

type Props = {
   isPriceUp: boolean;
   lastPrice: string;
};

export function LastTradePrice({ isPriceUp, lastPrice }: Readonly<Props>) {
   return (
      <div className="flex flex-col bg-base-background-l1 z-10 flex-0 snap-center px-3 py-1 sticky bottom-0">
         <div className="flex items-center flex-row gap-1.5">
            <p
               className={`font-medium tabular-nums ${
                  isPriceUp ? 'text-green-text' : 'text-red-text'
               } text-base 2xl:text-2xl`}
            >
               {lastPrice}
            </p>
         </div>
      </div>
   );
}
