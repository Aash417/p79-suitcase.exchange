'use client';

import { useMemo } from 'react';

export const BidTable = ({ bids }: { bids: [string, string][] }) => {
   const { bidsWithTotal, maxTotal } = useMemo(() => {
      let currentTotal = 0;
      const bidsWithTotal: [string, string, number][] = bids.map(
         ([price, quantity]) => {
            currentTotal += parseFloat(quantity);
            return [price, quantity, currentTotal];
         },
      );
      const maxTotal = bids.reduce(
         (acc, [, quantity]) => acc + parseFloat(quantity),
         0,
      );
      return { bidsWithTotal, maxTotal };
   }, [bids]);

   return (
      <div className="space-y-px">
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
   );
};

function Bid({
   price,
   quantity,
   total,
   maxTotal,
}: Readonly<{
   price: string;
   quantity: string;
   total: number;
   maxTotal: number;
}>) {
   const widthPercentage = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

   return (
      <div className="relative h-6">
         <div
            className="absolute inset-y-0 right-0 left-auto bg-[#0c5f43]/30 m-[1px]"
            style={{
               width: `${widthPercentage}%`,
               transition: 'width 0.3s ease-in-out',
            }}
         />
         <div className="grid grid-cols-3 text-xs relative z-10 px-2 h-full items-center">
            <div className="text-green-400 text-left">{price}</div>
            <div className="text-gray-300 text-right">{quantity}</div>
            <div className="text-gray-300 text-right">{total.toFixed(2)}</div>
         </div>
      </div>
   );
}
