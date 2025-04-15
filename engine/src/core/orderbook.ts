import { BASE_CURRENCY, Fill, Order } from '../utils/types';

export class Orderbook {
   quoteAsset: string = BASE_CURRENCY;
   constructor(
      public baseAsset: string,
      public bids: Order[],
      public asks: Order[],
      public currentPrice: number,
      public lastTradeId: number,
   ) {}

   ticker() {
      console.log(`Stated ticker : ${this.baseAsset}_${this.quoteAsset}`);
      return `${this.baseAsset}_${this.quoteAsset}`;
   }

   getSnapshot() {
      console.log('getting snapshot');
      return {
         bids: this.bids,
         asks: this.asks,
         baseAsset: this.baseAsset,
         lastTradeId: this.lastTradeId,
         currentPrice: this.currentPrice,
      };
   }

   addOrder(order: Order) {
      console.log('Stated addOrder');
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
      console.log('Stated matchBid');
      const fills: Fill[] = [];
      let executedQty = 0;

      for (const ask of this.asks) {
         if (ask.price <= order.price && executedQty < order.quantity) {
            const fillQty = Math.min(
               order.quantity - executedQty,
               ask.quantity,
            );
            executedQty += fillQty;
            ask.filled += fillQty;

            fills.push({
               price: ask.price,
               qty: fillQty,
               tradeId: ++this.lastTradeId,
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
      console.log('Stated matchAsk');
      const fills: Fill[] = [];
      let executedQty = 0;

      for (const bid of this.bids) {
         if (bid.price >= order.price && executedQty < order.quantity) {
            const fillQty = Math.min(
               order.quantity - executedQty,
               bid.quantity,
            );
            executedQty += fillQty;
            bid.filled += fillQty;

            fills.push({
               price: bid.price,
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

   getDepth() {
      const bidsMap: Record<number, number> = {};
      const asksMap: Record<number, number> = {};

      // Aggregate quantities for bids (buy orders)
      for (const bid of this.bids) {
         bidsMap[bid.price] = (bidsMap[bid.price] || 0) + bid.quantity;
      }

      // Aggregate quantities for asks (sell orders)
      for (const ask of this.asks) {
         asksMap[ask.price] = (asksMap[ask.price] || 0) + ask.quantity;
      }

      // Process bids: convert price to rupees, sort descending (highest bid first)
      const bids: [string, string][] = Object.entries(bidsMap)
         .sort((a, b) => Number(b[0]) - Number(a[0])) // Sort by original paisa value
         .map(([price, qty]) => [
            (Number(price) / 100).toFixed(2), // Convert paisa → rupees (e.g., 100050 → "1000.50")
            String(qty), // Keep quantity as-is (but format to 2 decimals)
         ]);

      // Process asks: convert price to rupees, sort ascending (lowest ask first)
      const asks: [string, string][] = Object.entries(asksMap)
         .sort((a, b) => Number(a[0]) - Number(b[0])) // Sort by original paisa value
         .map(([price, qty]) => [
            (Number(price) / 100).toFixed(2), // Convert paisa → rupees (e.g., 100040 → "1000.40")
            String(qty), // Keep quantity as-is (but format to 2 decimals)
         ]);

      return { bids, asks };
   }

   getOpenOrders(userId: string) {
      console.log('Stated getOpenOrders');
      const asks = this.asks.filter((x) => x.userId === userId);
      const bids = this.bids.filter((x) => x.userId === userId);
      return [...asks, ...bids];
   }

   cancelBid(order: Order) {
      console.log('Stated cancelBid');
      for (let i = 0; i < this.bids.length; i++) {
         if (this.bids[i].orderId === order.orderId) {
            this.bids.splice(i, 1);
            break;
         }
      }
   }

   cancelAsk(order: Order) {
      console.log('Stated cancelAsk');
      for (let i = 0; i < this.asks.length; i++) {
         if (this.asks[i].orderId === order.orderId) {
            this.asks.splice(i, 1);
            break;
         }
      }
   }
}
