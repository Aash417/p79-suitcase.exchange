'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

export default function SwapForm({ market }: Readonly<{ market: string }>) {
   const [activeTab, setActiveTab] = useState('buy');
   const [price, setPrice] = useState('');
   const [quantity, setQuantity] = useState('');
   const [totalPrice, setTotalPrice] = useState('');

   useEffect(() => {
      const rounded = (Number(price) * Number(quantity)).toFixed(2);
      setTotalPrice(rounded);
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
      console.log(order);
      try {
         console.time('one');
         const res = await fetch('http://localhost:3001/api/v1/order', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               accept: '*/*',
            },
            body: JSON.stringify(order),
         });

         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

         const data = await res.json();
         console.timeEnd('one')
         console.log('Response data:', data);
      } catch (error) {
         console.error('Error submitting order:', error);
      }
   }

   function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
      const regex = /^\d+(\.\d{0,2})?$/;
      const inputValue = e.target.value;
      if (inputValue === '') {
         setPrice('');
         return;
      }
      if (regex.test(inputValue)) setPrice(inputValue);
   }

   function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
      const regex = /^\d+$/;
      const inputValue = e.target.value;
      if (inputValue === '') {
         setQuantity('');
         return;
      }
      if (regex.test(inputValue)) setQuantity(inputValue);
   }

   return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="m-2">
         <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
               value="buy"
               className="data-[state=active]:bg-green-500/20 data-[state=active]:text-white"
            >
               Buy
            </TabsTrigger>
            <TabsTrigger
               value="sell"
               className="data-[state=active]:bg-red-500/20 data-[state=active]:text-white"
            >
               Sell
            </TabsTrigger>
         </TabsList>

         <TabsContent value="buy">
            <Card>
               <CardContent className="space-y-2">
                  <form onSubmit={handleSubmit}>
                     <div className="space-y-1">
                        <Label htmlFor="buy-price">Price</Label>
                        <Input
                           type="text"
                           value={price}
                           onChange={handlePriceChange}
                           placeholder="0"
                        />
                     </div>
                     <div className="space-y-1">
                        <Label htmlFor="buy-quantity">Quantity</Label>
                        <Input
                           type="text"
                           value={quantity}
                           onChange={handleQuantityChange}
                           placeholder="0"
                        />
                     </div>
                     <div className="space-y-1">
                        <Label htmlFor="buy-total">Total Price</Label>
                        <Input
                           id="buy-total"
                           value={totalPrice}
                           readOnly
                           disabled
                        />
                     </div>
                     <CardFooter>
                        <Button
                           type="submit"
                           className="bg-green-500/50 hover:bg-green-600"
                        >
                           Submit Buy Order
                        </Button>
                     </CardFooter>
                  </form>
               </CardContent>
            </Card>
         </TabsContent>

         <TabsContent value="sell">
            <Card>
               <CardContent className="space-y-2">
                  <form onSubmit={handleSubmit}>
                     <div className="space-y-1">
                        <Label htmlFor="sell-price">Price</Label>
                        <Input
                           type="text"
                           value={price}
                           onChange={handlePriceChange}
                           placeholder="0"
                        />
                     </div>
                     <div className="space-y-1">
                        <Label htmlFor="sell-quantity">Quantity</Label>
                        <Input
                           type="text"
                           value={quantity}
                           onChange={handleQuantityChange}
                           placeholder="0"
                        />
                     </div>
                     <div className="space-y-1">
                        <Label htmlFor="sell-total">Total Price</Label>
                        <Input
                           id="sell-total"
                           value={totalPrice}
                           readOnly
                           disabled
                        />
                     </div>
                     <CardFooter>
                        <Button
                           type="submit"
                           className="bg-red-500/50 hover:bg-red-600"
                        >
                           Submit Sell Order
                        </Button>
                     </CardFooter>
                  </form>
               </CardContent>
            </Card>
         </TabsContent>
      </Tabs>
   );
}
