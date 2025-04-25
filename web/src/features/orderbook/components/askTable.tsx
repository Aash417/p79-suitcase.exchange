'use client';

import { useMemo } from 'react';

export const AskTable = ({ asks }: { asks: [string, string][] }) => {
   const { asksWithTotal, maxTotal } = useMemo(() => {
      let currentTotal = 0;
      const asksWithTotal: [string, string, number][] = asks.map(
         ([price, quantity]) => [
            price,
            quantity,
            (currentTotal += parseFloat(quantity)),
         ],
      );
      const maxTotal = asks.reduce(
         (acc, [_, quantity]) => acc + parseFloat(quantity),
         0,
      );
      return { asksWithTotal, maxTotal };
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
            className="absolute inset-0 bg-red-900/30 m-[1px]"
            style={{
               width: `${widthPercentage}%`,
               transition: 'width 0.3s ease-in-out',
            }}
         />
         <div className="flex justify-between text-xs relative z-10 px-2 h-full items-center">
            <div className="text-red-400">{price}</div>
            <div>{quantity}</div>
            <div>{total.toFixed(2)}</div>
         </div>
      </div>
   );
}
