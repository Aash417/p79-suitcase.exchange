/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExecuteOrder, useGetUserBalances } from '@/hooks';
import { SYMBOLS_MAP } from '@/lib/constants';
import { API_URL } from '@/lib/env';
import { formatComma } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = {
   market: string;
};

export default function SwapForm({ market }: Readonly<Props>) {
   const [activeTab, setActiveTab] = useState('buy');
   const [price, setPrice] = useState('');
   const [priceFormatted, setPriceFormatted] = useState('');
   const [quantity, setQuantity] = useState('');
   const [quantityFormatted, setQuantityFormatted] = useState('');
   const [totalPrice, setTotalPrice] = useState('');
   const { mutate } = useExecuteOrder(market);
   const { data: balance, isLoading, error } = useGetUserBalances();

   const calculatedTotal = (Number(price) * Number(quantity)).toFixed(2);
   const getAssetBalance = (asset: string) => {
      if (!balance || !balance[asset]) return 0;
      return balance[asset].available / 100;
   };

   const [baseAsset, quoteAsset] = market.split('_');
   const currentBalance =
      activeTab === 'buy'
         ? getAssetBalance(quoteAsset)
         : getAssetBalance(baseAsset);

   useEffect(() => {
      const formattedTotal = Number(calculatedTotal).toLocaleString('en-US', {
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
      });
      setTotalPrice(formattedTotal);
   }, [price, quantity]);

   async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();

      if (Number(calculatedTotal) > currentBalance && activeTab === 'buy') {
         toast.error('Insufficient funds for transaction.!', {
            duration: 2000,
         });
         return;
      }

      const data = {
         market,
         price: String(Number(price) * 100),
         quantity,
         side: activeTab,
         userId: '47854',
      };

      try {
         mutate(data, {
            onSuccess: () => {
               setPrice('');
               setPriceFormatted('');
               setQuantity('');
               setQuantityFormatted('');
               setTotalPrice('');
            },
         });
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
      <Tabs
         value={activeTab}
         onValueChange={setActiveTab}
         className={`w-full ${
            API_URL === 'https://api.backpack.exchange/api/v1'
               ? 'opacity-40 pointer-events-none'
               : ''
         }`}
      >
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

            {isLoading ? (
               <span className="text-xs text-gray-400">...</span>
            ) : (
               <span className="text-xs text-gray-400">
                  {formatComma(currentBalance)}{' '}
                  {activeTab === 'buy' ? 'USDC' : baseAsset}
               </span>
            )}
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
               disabled={!price || !quantity || !currentBalance}
            >
               {activeTab === 'buy' ? 'Buy' : 'Sell'} {baseAsset}
            </Button>
         </div>
      </Tabs>
   );
}
