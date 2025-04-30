/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { SYMBOLS } from '@/lib/constants';
import { API_URL } from '@/lib/env';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';

export default function DepositForm() {
   const [quantity, setQuantity] = useState(''); // for calculations
   const [quantityFormatted, setQuantityFormatted] = useState('');
   const [asset, setAsset] = useState('USDC'); // for calculations

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

   async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      const payload = {
         asset,
         quantity: String(Number(quantity) * 100),
         userId: '47854',
      };

      try {
         console.time('one');
         const res = await fetch(`${API_URL}/order/on-ramp`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               accept: '*/*',
            },
            body: JSON.stringify(payload),
         });

         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

         const data = await res.json();
         console.timeEnd('one');
         console.log('Response data:', data);
      } catch (error) {
         console.error('Error depositing asset:', error);
      }
   }

   return (
      <div className="space-y-3">
         <Select value={asset} onValueChange={setAsset} defaultValue="USDC">
            <SelectTrigger className="w-full h-10 px-3 py-2 rounded-lg bg-[#1C1D21] border-none  text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#3B3C42] hover:bg-[#2C2D33]/50 transition-colors">
               <div className="flex items-center gap-2">
                  <div className="size-5 rounded-full overflow-hidden">
                     {asset === 'USDC' ? (
                        <img
                           src="/usdc.webp"
                           alt=""
                           className="object-cover w-full h-full"
                        />
                     ) : (
                        <img
                           src={
                              SYMBOLS.find(
                                 (s) => s.symbol.split('_')[0] === asset,
                              )?.imageUrl
                           }
                           alt=""
                           className="object-cover w-full h-full"
                        />
                     )}
                  </div>
                  <SelectValue className="text">{asset}</SelectValue>
               </div>
            </SelectTrigger>
            <SelectContent className="bg-[#1C1D21] border border-[#2C2D33] text-gray-100 rounded-lg shadow-lg">
               <SelectGroup>
                  <SelectItem
                     value="USDC"
                     className="flex items-center gap-2 px-3 py-2 hover:bg-[#2C2D33] focus:bg-[#2C2D33] focus:text-gray-100 cursor-pointer"
                  >
                     <div className="flex items-center gap-2">
                        <div className="size-5 rounded-full overflow-hidden">
                           <img
                              src="/usdc.webp"
                              alt=""
                              className="object-cover w-full h-full"
                           />
                        </div>
                        USDC
                     </div>
                  </SelectItem>
                  {SYMBOLS.map((symbol, idx) => (
                     <SelectItem
                        key={idx + 1}
                        value={symbol.symbol.split('_')[0]}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-[#2C2D33] focus:bg-[#2C2D33] focus:text-gray-100 cursor-pointer"
                     >
                        <div className="flex items-center gap-2">
                           <div className="size-5 rounded-full overflow-hidden">
                              <img
                                 src={symbol.imageUrl}
                                 alt=""
                                 className="object-cover w-full h-full"
                              />
                           </div>
                           {symbol.symbol.split('_')[0]}
                        </div>
                     </SelectItem>
                  ))}
               </SelectGroup>
            </SelectContent>
         </Select>

         <div>
            <Label className=" text-gray-400 text-xs">Quantity</Label>
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
                     src={
                        asset === 'USDC'
                           ? '/usdc.webp'
                           : SYMBOLS.find(
                                (s) => s.symbol.split('_')[0] === asset,
                             )?.imageUrl
                     }
                     alt=""
                     className="object-cover w-full h-full"
                  />
               </div>
            </div>
         </div>

         <Button
            className="w-full cursor-pointer bg-white/30 hover:bg-white/50"
            type="submit"
            onClick={handleSubmit}
            disabled={!quantity}
         >
            Deposit
         </Button>
      </div>
   );
}
