import { BASE_CURRENCY, Fill, Order } from '../utils/types';

export class Orderbook {
   quoteAsset: string = BASE_CURRENCY;
   constructor(
      public baseAsset: string,
      public bids: Order[],
      public asks: Order[],
      public currentPrice: number,
      public lastTradeId: number
   ) {}

   ticker() {
      console.log(`Ticker: ${this.baseAsset}_${this.quoteAsset}`);
      return `${this.baseAsset}_${this.quoteAsset}`;
   }

   getSnapshot() {
      return {
         bids: this.bids,
         asks: this.asks,
         baseAsset: this.baseAsset,
         lastTradeId: this.lastTradeId,
         currentPrice: this.currentPrice,
      };
   }

   addOrder(order: Order) {
      const isBuy = order.side === 'buy';
      const { executedQty, fills } = isBuy
         ? this.matchBid(order)
         : this.matchAsk(order);

      order.filled = executedQty;

      if (executedQty < order.quantity) {
         this.insertAndSort(order);
      }

      return { executedQty, fills };
   }

   insertAndSort(order: Order) {
      if (order.side === 'buy') {
         this.bids.push(order);
         this.bids.sort((a, b) => b.price - a.price); // high → low
      } else {
         this.asks.push(order);
         this.asks.sort((a, b) => a.price - b.price); // low → high
      }
   }

   matchBid(order: Order) {
      const fills: Fill[] = [];
      let executedQty = 0;

      for (const ask of this.asks) {
         if (ask.price <= order.price && executedQty < order.quantity) {
            const fillQty = Math.min(
               order.quantity - executedQty,
               ask.quantity
            );
            executedQty += fillQty;
            ask.filled += fillQty;

            fills.push({
               price: ask.price.toString(),
               qty: fillQty,
               tradeId: this.lastTradeId++,
               otherUserId: ask.userId,
               markerOrderId: ask.orderId,
            });
         }
      }

      //  remove fully filled asks
      this.asks = this.asks.filter((a) => a.filled < a.quantity);

      return { fills, executedQty };
   }

   matchAsk(order: Order) {
      const fills: Fill[] = [];
      let executedQty = 0;

      for (const bid of this.bids) {
         if (bid.price >= order.price && executedQty < order.quantity) {
            const fillQty = Math.min(
               order.quantity - executedQty,
               bid.quantity
            );
            executedQty += fillQty;
            bid.filled += fillQty;

            fills.push({
               price: bid.price.toString(),
               qty: fillQty,
               tradeId: this.lastTradeId++,
               otherUserId: bid.userId,
               markerOrderId: bid.orderId,
            });
         }
      }

      // Remove fully filled bids
      this.bids = this.bids.filter((b) => b.filled < b.quantity);

      return { fills, executedQty };
   }

   cancelBid(order: Order) {
      for (let i = 0; i < this.bids.length; i++) {
         if (this.bids[i].orderId === order.orderId) {
            this.bids.splice(i, 1);
            break;
         }
      }
   }

   cancelAsk(order: Order) {
      for (let i = 0; i < this.asks.length; i++) {
         if (this.asks[i].orderId === order.orderId) {
            this.asks.splice(i, 1);
            break;
         }
      }
   }

   getDepth() {
      const bids: [string, string][] = [];
      const asks: [string, string][] = [];
      const bidsObj: { [key: string]: number } = {};
      const asksObj: { [key: string]: number } = {};

      for (const bid of this.bids) {
         if (!bidsObj[bid.price]) {
            bidsObj[bid.price] = 0;
         }
         bidsObj[bid.price] += bid.quantity;
      }

      for (const ask of this.asks) {
         if (!asksObj[ask.price]) {
            asksObj[ask.price] = 0;
         }
         asksObj[ask.price] += ask.quantity;
      }

      for (const price in bidsObj) {
         bids.push([price, bidsObj[price].toString()]);
      }
      for (const price in asksObj) {
         asks.push([price, asksObj[price].toString()]);
      }
      return {
         bids,
         asks,
      };
   }

   getOpenOrders(userId: string) {
      const asks = this.asks.filter((x) => x.userId === userId);
      const bids = this.bids.filter((x) => x.userId === userId);
      return [...asks, ...bids];
   }
}
