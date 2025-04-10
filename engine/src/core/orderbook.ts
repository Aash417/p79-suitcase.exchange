import { Fill, Order } from '../utils/types';

export class Orderbook {
   bids: Order[];
   asks: Order[];
   baseAsset: string;
   quoteAsset: string;
   lastTradeId: number;
   currentPrice: number;

   constructor(
      baseAsset: string,
      bids: Order[],
      asks: Order[],
      currentPrice: number,
      lastTradeId: number
   ) {
      this.bids = bids;
      this.asks = asks;
      this.baseAsset = baseAsset;
      this.currentPrice = currentPrice;
      this.lastTradeId = lastTradeId;
   }

   ticker() {
      return `${this.baseAsset}-${this.quoteAsset}`;
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
      if (order.side === 'buy') {
         const { executedQty, fills } = this.matchBid(order);
         order.filled = executedQty;
         if (executedQty === order.quantity) {
            return {
               executedQty,
               fills,
            };
         }
         this.bids.push(order);
         return {
            executedQty,
            fills,
         };
      } else {
         const { executedQty, fills } = this.matchAsk(order);
         order.filled = executedQty;
         if (executedQty === order.quantity) {
            return {
               executedQty,
               fills,
            };
         }
         this.asks.push(order);
         return {
            executedQty,
            fills,
         };
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

      for (let i = 0; i < this.asks.length; i++) {
         if (this.asks[i].filled === this.asks[i].quantity) {
            this.asks.splice(i, 1);
         }
      }

      return {
         fills,
         executedQty,
      };
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

      for (let i = 0; i < this.bids.length; i++) {
         if (this.bids[i].filled === this.bids[i].quantity) {
            this.bids.splice(i, 1);
         }
      }
      return {
         fills,
         executedQty,
      };
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

   getBestBid() {
      return this.bids[0];
   }

   getBestAsk() {
      return this.asks[0];
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
