'use client';

import { useMemo } from 'react';

export const AskTable = ({ asks }: { asks: [string, string][] }) => {
   const { asksWithTotal, maxTotal } = useMemo(() => {
      let currentTotal = 0;
      const asksWithTotal: [string, string, number][] = asks.map(
         ([price, quantity]) => {
            currentTotal += parseFloat(quantity);
            return [price, quantity, currentTotal];
         }
      );
      const maxTotal = asks.reduce(
         (acc, [, quantity]) => acc + parseFloat(quantity),
         0
      );
      return { asksWithTotal, maxTotal };
   }, [asks]);

   return (
      <div className="flex flex-col flex-1">
         <div className="flex justify-end h-full w-full flex-col-reverse">
            {asksWithTotal.map(([price, quantity, total]) => (
               <Ask
                  maxTotal={maxTotal}
                  total={total}
                  key={`${price}-${quantity}`}
                  price={price}
                  quantity={quantity}
               />
            ))}
         </div>
      </div>
   );
};

function Ask({
   price,
   quantity,
   total,
   maxTotal
}: Readonly<{
   price: string;
   quantity: string;
   total: number;
   maxTotal: number;
}>) {
   const widthPercentage = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

   return (
      <div className="flex h-[25px] items-center">
         <div className="flex items-center flex-row relative h-full w-full overflow-hidden px-3 border-t hover:border-base-border-focus/50 border-dashed border-transparent">
            {/* background effect  */}
            <div
               style={{
                  position: 'absolute',
                  top: '1px',
                  bottom: '1px',
                  right: '12px',
                  background: 'rgba(253, 75, 78, 0.32)',
                  width: `${widthPercentage}%`,
                  transition: 'width 0.4s ease-in-out'
               }}
            />
            <div className="flex h-full w-[30%] items-center">
               <p className="z-[1] text-left text-xs font-normal tabular-nums text-red-text/90">
                  {price}
               </p>
            </div>
            {/* size  */}
            <div className="flex h-full w-[35%] items-center justify-end">
               <p className="z-[1] text-right text-xs font-normal tabular-nums text-high-emphasis/80">
                  {quantity}
               </p>
            </div>
            {/* total  */}
            <div className="flex h-full w-[35%] items-center justify-end">
               <p className="z-[1] pr-2 text-right text-xs font-normal tabular-nums text-high-emphasis/80">
                  {total.toFixed(2)}
               </p>
            </div>
         </div>
      </div>
   );
}
