'use client';

import { AskTable } from './components/ask-table';
import { BidTable } from './components/bid-table';
import { LastTradePrice } from './components/last-trade-price';
import { TableHeader } from './components/table-header';

type Props = {
   topAsks: [string, string][];
   topBids: [string, string][];
   lastPrice: string;
   isPriceUp: boolean;
};

export function Orderbook({
   topAsks,
   topBids,
   isPriceUp,
   lastPrice
}: Readonly<Props>) {
   return (
      <div className="flex flex-col h-full grow overflow-x-hidden">
         <TableHeader />

         <div className="flex flex-col h-full flex-1 pb-1">
            <AskTable asks={topAsks} />
            <LastTradePrice isPriceUp={isPriceUp} lastPrice={lastPrice} />
            <BidTable bids={topBids} />
         </div>

         {/* <OrderbookStatus/> */}
      </div>
   );
}
