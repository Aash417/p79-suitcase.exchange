'use client';

import { useEffect, useState } from 'react';
import {
   getDepth,
   getTicker,
   getTrades
} from '../../utils/httpClient';
import { SignalingManager } from '../../utils/SignalingManager';
import { AskTable } from './AskTable';
import { BidTable } from './BidTable';

export function Depth({ market }: { market: string }) {
   const [bids, setBids] = useState<[string, string][]>();
   const [asks, setAsks] = useState<[string, string][]>();
   const [price, setPrice] = useState<string>();

   useEffect(() => {
      SignalingManager.getInstance().registerCallback(
         'depth',
         (data: any) => {
            console.log('depth has been updated');
            console.log(data);

            setBids((originalBids) => {
               const bidsAfterUpdate = [...(originalBids || [])];

               for (let i = 0; i < bidsAfterUpdate.length; i++) {
                  for (const element of data.bids) {
                     if (bidsAfterUpdate[i] && bidsAfterUpdate[i][0] === element[0]) {
                        if (bidsAfterUpdate[i]) {
                           bidsAfterUpdate[i][1] = element[1];
                        }
                        if (bidsAfterUpdate[i] && Number(bidsAfterUpdate[i][1]) === 0) {
                           bidsAfterUpdate.splice(i, 1);
                        }
                        break;
                     }
                  }
               }

               for (const element of data.bids) {
                  if (
                     Number(element[1]) !== 0 &&
                     !bidsAfterUpdate.map((x) => x[0]).includes(element[0])
                  ) {
                     bidsAfterUpdate.push(element);
                     break;
                  }
               }
               bidsAfterUpdate.sort((x, y) =>
                  Number(y[0]) > Number(x[0]) ? -1 : 1,
               );
               return bidsAfterUpdate;
            });

            setAsks((originalAsks) => {
               const asksAfterUpdate = [...(originalAsks || [])];

               for (let i = 0; i < asksAfterUpdate.length; i++) {
                  for (const ask of data.asks || []) {
                     if (asksAfterUpdate[i]?.[0] === ask?.[0]) {
                        asksAfterUpdate[i][1] = ask[1];
                        if (Number(asksAfterUpdate[i]?.[1]) === 0) {
                           asksAfterUpdate.splice(i, 1);
                        }
                        break;
                     }
                  }
               }

               for (const element of data.asks) {
                  if (
                     Number(element[1]) !== 0 &&
                     !asksAfterUpdate.map((x) => x[0]).includes(element[0])
                  ) {
                     asksAfterUpdate.push(element);
                     break;
                  }
               }
               asksAfterUpdate.sort((x, y) =>
                  Number(y[0]) > Number(x[0]) ? 1 : -1,
               );
               return asksAfterUpdate;
            });
         },
         `DEPTH-${market}`,
      );

      SignalingManager.getInstance().sendMessage({
         method: 'SUBSCRIBE',
         params: [`depth@${market}`],
      });

      getDepth(market).then((d) => {
         setBids(d.bids.reverse());
         setAsks(d.asks);
      });

      getTicker(market).then((t) => setPrice(t.lastPrice));
      getTrades(market).then((t) => setPrice(t[0].price));

      return () => {
         SignalingManager.getInstance().sendMessage({
            method: 'UNSUBSCRIBE',
            params: [`depth@${market}`],
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
