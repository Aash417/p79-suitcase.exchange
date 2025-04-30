/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SYMBOLS_MAP } from '@/lib/constants';
import { API_URL } from '@/lib/env';
import { formatComma } from '@/lib/utils';
import { useEffect, useState } from 'react';
type Props = {
   market: string;
   balance: {
      [key: string]: {
         available: number;
         locked: number;
      };
   };
};

export default function SwapForm({ market, balance }: Readonly<Props>) {
   const [activeTab, setActiveTab] = useState('buy');
   const [price, setPrice] = useState('');
   const [priceFormatted, setPriceFormatted] = useState('');
   const [quantity, setQuantity] = useState('');
   const [quantityFormatted, setQuantityFormatted] = useState('');
   const [totalPrice, setTotalPrice] = useState('');

   useEffect(() => {
      const calculatedTotal = (Number(price) * Number(quantity)).toFixed(2);
      const formattedTotal = Number(calculatedTotal).toLocaleString('en-US', {
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
      });
      setTotalPrice(formattedTotal);
   }, [price, quantity]);

   async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      const order = {
         market,
         price: String(Number(price) * 100),
         quantity,
         side: activeTab,
         userId: '47854',
      };

      try {
         console.time('one');
         const res = await fetch(`${API_URL}/order`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               accept: '*/*',
            },
            body: JSON.stringify(order),
         });

         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

         const data = await res.json();
         console.timeEnd('one');
         console.log('Response data:', data);
      } catch (error) {
         console.error('Error submitting order:', error);
      }
   }

   function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
      const regex = /^(\d*\.?\d{0,2}|\d*\.?)$/;
      const inputValue = e.target.value;
      const valueWithoutCommas = inputValue.replace(/,/g, '');

      if (valueWithoutCommas === '') {
         setPrice('');
         setPriceFormatted('');
         return;
      }

      if (valueWithoutCommas === '.') {
         setPrice('0.');
         setPriceFormatted('0.');
         return;
      }

      if (regex.test(valueWithoutCommas)) {
         // Clean the value for calculations
         let cleanValue = valueWithoutCommas;
         if (
            cleanValue.length > 1 &&
            cleanValue.startsWith('0') &&
            cleanValue[1] !== '.'
         ) {
            cleanValue = cleanValue.replace(/^0+/, '');
         }

         setPrice(cleanValue);

         if (!cleanValue.endsWith('.')) {
            const formattedValue = Number(cleanValue).toLocaleString('en-US', {
               minimumFractionDigits: cleanValue.includes('.')
                  ? cleanValue.split('.')[1].length
                  : 0,
               maximumFractionDigits: 2,
            });
            setPriceFormatted(formattedValue);
         } else {
            setPriceFormatted(cleanValue);
         }
      }
   }

   function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
      const regex = /^\d+$/;
      const inputValue = e.target.value;
      const valueWithoutCommas = inputValue.replace(/,/g, '');

      if (valueWithoutCommas === '') {
         setQuantity('');
         setQuantityFormatted('');
         return;
      }

      if (regex.test(valueWithoutCommas)) {
         setQuantity(valueWithoutCommas);

         const formattedValue =
            Number(valueWithoutCommas).toLocaleString('en-US');
         setQuantityFormatted(formattedValue);
      }
   }

   return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
         <TabsList className="grid w-full grid-cols-2 mb-4 bg-[#d4d4d408] text-gray-500">
            <TabsTrigger
               value="buy"
               className=" data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500"
            >
               Buy
            </TabsTrigger>
            <TabsTrigger
               value="sell"
               className=" data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500"
            >
               Sell
            </TabsTrigger>
         </TabsList>

         <div className="flex  justify-between">
            <Label className=" text-gray-400 text-xs underline">Balance</Label>
            <span className="text-xs text-gray-400">
               {activeTab === 'buy'
                  ? formatComma(balance[market.split('_')[1]].available / 100) +
                    ' USDC'
                  : formatComma(balance[market.split('_')[0]].available / 100) +
                    ' ' +
                    market.split('_')[0]}
            </span>
         </div>

         <div className="space-y-3">
            <div>
               <Label className=" text-gray-400 text-xs">Price</Label>
               <div className="relative">
                  <Input
                     type="text"
                     value={priceFormatted}
                     onChange={handlePriceChange}
                     placeholder="0"
                     className="mt-1"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 size-5 rounded-full overflow-hidden">
                     <img
                        src="/usdc.webp"
                        alt=""
                        className="object-cover w-full h-full"
                     />
                  </div>
               </div>
            </div>

            <div>
               <Label className="flex justify-between text-gray-400 text-xs">
                  Quantity
               </Label>
               <div className="relative">
                  <Input
                     type="text"
                     value={quantityFormatted}
                     onChange={handleQuantityChange}
                     placeholder="0"
                     className="mt-1"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 size-5 rounded-full overflow-hidden">
                     <img
                        src={SYMBOLS_MAP.get(market)?.imageUrl}
                        alt=""
                        className="object-cover w-full h-full"
                     />
                  </div>
               </div>
            </div>

            <div>
               <Label className="text-xs flex  text-gray-400 ">
                  Order value
               </Label>
               <div className="relative">
                  <Input
                     type="text"
                     value={totalPrice}
                     readOnly
                     disabled
                     className="mt-1"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 size-5 rounded-full overflow-hidden">
                     <img
                        src="/usdc.webp"
                        alt=""
                        className="object-cover w-full h-full"
                     />
                  </div>
               </div>
            </div>

            <Button
               className={`w-full cursor-pointer ${
                  activeTab === 'buy'
                     ? 'bg-green-500 hover:bg-green-600'
                     : 'bg-red-500 hover:bg-red-600'
               }`}
               type="submit"
               onClick={handleSubmit}
               disabled={!price || !quantity}
            >
               {activeTab === 'buy' ? 'Buy' : 'Sell'} {market.split('_')[0]}
            </Button>
         </div>
      </Tabs>
   );
}
