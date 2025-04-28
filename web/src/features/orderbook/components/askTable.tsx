'use client';

import { useMemo } from 'react';

export const AskTable = ({ asks }: { asks: [string, string][] }) => {
   const { asksWithTotal, maxTotal } = useMemo(() => {
      let currentTotal = 0;
      const revAsk = [...asks].reverse();
      const total = asks.map(
         ([, quantity]) => (currentTotal += parseFloat(quantity)),
      );
      const revTotal = [...total].reverse();

      const asksWithTotal: [string, string, number][] = revAsk.map(
         ([price, quantity], index) => {
            return [price, quantity, revTotal[index]];
         },
      );
      return { asksWithTotal, maxTotal: revTotal[0] };
   }, [asks]);

   return (
      <div className="space-y-px">
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
   );
};

function Ask({
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
            className="absolute inset-y-0 right-0 left-auto bg-[#792c31]/30 m-[1px]"
            style={{
               width: `${widthPercentage}%`,
               transition: 'width 0.4s ease-in-out',
            }}
         />
         <div className="grid grid-cols-3 text-xs relative z-10 px-2 h-full items-center">
            <div className="text-red-400 text-left">{price}</div>
            <div className="text-gray-300 text-right">{quantity}</div>
            <div className="text-gray-300 text-right">{total.toFixed(2)}</div>
         </div>
      </div>
   );
}
