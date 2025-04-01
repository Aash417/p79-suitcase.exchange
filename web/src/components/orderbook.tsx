'use client';

import { SignalingManager } from '@/lib/SignalingManager';
import { Depth } from '@/lib/types';
import { useEffect, useState } from 'react';
import { AskTable } from './AskTable';
import { BidTable } from './BidTable';

type Props = {
   market: string;
   depthdata: Depth;
};

export default function Orderbook({ market, depthdata }: Readonly<Props>) {
   const [bids, setBids] = useState<[string, string][]>();
   const [asks, setAsks] = useState<[string, string][]>();
   const [price, setPrice] = useState<string>();

   useEffect(() => {
      SignalingManager.getInstance().registerCallback(
         'depth',
         (data: any) => {
            setBids((originalBids) => {
               const bidsAfterUpdate = [...(originalBids || [])];

               for (const element of bidsAfterUpdate) {
                  for (let j = 0; j < data.bids.length; j++) {
                     if (element[0] === data.bids[j][0]) {
                        element[1] = data.bids[j][1];
                        break;
                     }
                  }
               }
               return bidsAfterUpdate;
            });

            setAsks((originalAsks) => {
               const asksAfterUpdate = [...(originalAsks || [])];

               for (const element of asksAfterUpdate) {
                  for (let j = 0; j < data.asks.length; j++) {
                     if (element[0] === data.asks[j][0]) {
                        element[1] = data.asks[j][1];
                        break;
                     }
                  }
               }
               return asksAfterUpdate;
            });
         },
         `DEPTH-${market}`,
      );

      SignalingManager.getInstance().sendMessage({
         method: 'SUBSCRIBE',
         params: [`depth.${market}`],
      });

      setBids(depthdata.bids.reverse());
      setAsks(depthdata.asks);

      // getTicker(market).then((t) => setPrice(t.lastPrice));
      // getTrades(market).then((t) => setPrice(t[0].price));
      // getKlines(market, "1h", 1640099200, 1640100800).then(t => setPrice(t[0].close));
      return () => {
         SignalingManager.getInstance().sendMessage({
            method: 'UNSUBSCRIBE',
            params: [`depth.200ms.${market}`],
         });
         SignalingManager.getInstance().deRegisterCallback(
            'depth',
            `DEPTH-${market}`,
         );
      };
   }, []);

   return (
      <div>
         <TableHeader />
         {asks && <AskTable asks={asks} />}
         {price && <div>{price}</div>}
         {bids && <BidTable bids={bids} />}
      </div>
   );
}

function TableHeader() {
   return (
      <div className="flex justify-between text-xs">
         <div className="text-white">Price</div>
         <div className="text-slate-500">Size</div>
         <div className="text-slate-500">Total</div>
      </div>
   );
}
