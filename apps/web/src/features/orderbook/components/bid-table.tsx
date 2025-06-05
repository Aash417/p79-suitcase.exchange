'use client';

import { useMemo } from 'react';

export const BidTable = ({ bids }: { bids: [string, string][] }) => {
   const { bidsWithTotal, maxTotal } = useMemo(() => {
      let currentTotal = 0;
      const bidsWithTotal: [string, string, number][] = bids.map(
         ([price, quantity]) => {
            currentTotal += parseFloat(quantity);
            return [price, quantity, currentTotal];
         }
      );
      const maxTotal = bids.reduce(
         (acc, [, quantity]) => acc + parseFloat(quantity),
         0
      );
      return { bidsWithTotal, maxTotal };
   }, [bids]);

   return (
      <div className="flex flex-col flex-1 min-h-[35vh]">
         <div className="flex justify-start flex-col h-full w-full">
            {bidsWithTotal.map(([price, quantity, total]) => (
               <Bid
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

function Bid({
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
      <div className="flex h-[3.5vh] items-center">
         <div className="flex items-center flex-row relative h-full w-full overflow-hidden px-3 border-t hover:border-base-border-focus/50 border-dashed border-transparent">
            {/* background effect  */}
            <div
               style={{
                  position: 'absolute',
                  top: '1px',
                  bottom: '1px',
                  right: '12px',
                  background: 'rgba(0, 194, 120, 0.32)',
                  width: `${widthPercentage}%`,
                  transition: 'width 0.4s ease-in-out'
               }}
            />
            <div className="flex h-full w-[30%] items-center">
               <p className="z-[1] text-left text-xs font-normal tabular-nums text-green-text/90">
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
