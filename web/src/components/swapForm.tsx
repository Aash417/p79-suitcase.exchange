'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

export default function SwapForm() {
   const [activeTab, setActiveTab] = useState('buy');

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
                  <div className="space-y-1">
                     <Label htmlFor="asset">Price</Label>
                     <Input id="asset" defaultValue="BTC" />
                  </div>
                  <div className="space-y-1">
                     <Label htmlFor="amount">Quantity</Label>
                     <Input id="amount" defaultValue="1.0" />
                  </div>
               </CardContent>
               <CardFooter>
                  <Button className="bg-green-500/50 hover:bg-green-600">
                     Submit Buy Order
                  </Button>
               </CardFooter>
            </Card>
         </TabsContent>
         <TabsContent value="sell">
            <Card>
               <CardContent className="space-y-2">
                  <div className="space-y-1">
                     <Label htmlFor="sell-asset">Price</Label>
                     <Input id="sell-asset" defaultValue="BTC" />
                  </div>
                  <div className="space-y-1">
                     <Label htmlFor="sell-amount">Quantity</Label>
                     <Input id="sell-amount" defaultValue="0.5" />
                  </div>
               </CardContent>
               <CardFooter>
                  <Button className="bg-red-500/50 hover:bg-red-600">
                     Submit Sell Order
                  </Button>
               </CardFooter>
            </Card>
         </TabsContent>
      </Tabs>
   );
}
