import { QUOTE_ASSET } from '../utils/constants';
import { Fill, Order, ORDER_SIDE } from '../utils/types';

export class OrderBookService {
   private bids = new Map<number, Order[]>(); // price => orders (sorted high to low)
   private asks = new Map<number, Order[]>(); // price => orders (sorted low to high)
   public readonly quoteAsset = QUOTE_ASSET;

   constructor(
      public readonly baseAsset: string,

      public lastTradeId: number = 125,
   ) {}
   // For snapshot deserialization
   initialize(bids: Order[], asks: Order[], lastTradeId: number) {
      this.bids = this.groupOrdersByPrice(bids, 'desc');
      this.asks = this.groupOrdersByPrice(asks, 'asc');
      this.lastTradeId = lastTradeId;
   }

   // For snapshot serialization
   getBidsMap(): Map<number, Order[]> {
      return new Map(this.bids); // Return a copy
   }

   getAsksMap(): Map<number, Order[]> {
      return new Map(this.asks);
   }

   ticker() {
      return `${this.baseAsset}_${this.quoteAsset}`; // SOL_USDC
   }

   addOrder(order: Order) {
      const isBuy = order.side === 'buy';
      const { fills, executedQty } = isBuy
         ? this.matchBid(order)
         : this.matchAsk(order);

      if (executedQty < order.quantity) {
         this.insertOrder({
            ...order,
            quantity: order.quantity - executedQty,
         });
      }

      return { orderId: ++this.lastTradeId, fills, executedQty };
   }

   cancelOrder(orderId: string, side: ORDER_SIDE): boolean {
      if (side === 'buy') return this.cancelBid(orderId);
      else return this.cancelAsk(orderId);
   }

   getDepth(): { bids: [number, number][]; asks: [number, number][] } {
      const aggregate = (map: Map<number, Order[]>) => {
         const result = new Map<number, number>();
         for (const [price, orders] of map) {
            result.set(
               price,
               orders.reduce((sum, o) => sum + o.quantity, 0),
            );
         }
         return Array.from(result.entries());
      };

      return {
         bids: aggregate(this.bids).sort((a, b) => b[0] - a[0]),
         asks: aggregate(this.asks).sort((a, b) => a[0] - b[0]),
      };
   }

   findOrder(orderId: string): { order: Order; side: ORDER_SIDE } | undefined {
      for (const ordersAtPrice of this.bids.values()) {
         const order = ordersAtPrice.find((o) => o.orderId === orderId);
         if (order) return { order, side: 'buy' };
      }

      for (const ordersAtPrice of this.asks.values()) {
         const order = ordersAtPrice.find((o) => o.orderId === orderId);
         if (order) return { order, side: 'sell' };
      }

      return undefined;
   }

   private cancelBid(orderId: string): boolean {
      return this.removeOrderFromMap(this.bids, orderId);
   }

   private cancelAsk(orderId: string): boolean {
      return this.removeOrderFromMap(this.asks, orderId);
   }

   private removeOrderFromMap(
      priceMap: Map<number, Order[]>,
      orderId: string,
   ): boolean {
      for (const [price, orders] of priceMap) {
         const filteredOrders = orders.filter((o) => o.orderId !== orderId);

         if (filteredOrders.length !== orders.length) {
            if (filteredOrders.length > 0) {
               priceMap.set(price, filteredOrders);
            } else {
               priceMap.delete(price); // Clean up empty price levels
            }
            return true;
         }
      }
      return false;
   }

   private matchBid(order: Order): { fills: Fill[]; executedQty: number } {
      const fills: Fill[] = [];
      let remainingQty = order.quantity;

      // 1. Iterate asks from lowest to highest price (Map keys are already sorted)
      for (const [askPrice, ordersAtPrice] of this.asks) {
         // 2. Stop if no more possible matches
         if (askPrice > order.price || remainingQty <= 0) break;

         // 3. Match against all orders at this price level
         for (const ask of ordersAtPrice) {
            const fillQty = Math.min(remainingQty, ask.quantity);
            fills.push(this.createFill(ask, askPrice, fillQty));
            remainingQty -= fillQty;
            ask.quantity -= fillQty;

            // 4. Early exit if order is fully filled
            if (remainingQty <= 0) break;
         }

         // 5. Clean up fully filled orders at this price level
         const remainingOrders = ordersAtPrice.filter(
            (ask) => ask.quantity > 0,
         );
         if (remainingOrders.length > 0)
            this.asks.set(askPrice, remainingOrders);
         else this.asks.delete(askPrice); // Remove empty price levels
      }

      return { fills, executedQty: order.quantity - remainingQty };
   }

   private matchAsk(order: Order): { fills: Fill[]; executedQty: number } {
      const fills: Fill[] = [];
      let remainingQty = order.quantity;

      for (const [bidPrice, ordersAtPrice] of this.bids) {
         if (bidPrice < order.price || remainingQty <= 0) break;

         for (const bid of ordersAtPrice) {
            const fillQty = Math.min(remainingQty, bid.quantity);
            fills.push(this.createFill(bid, bidPrice, fillQty));
            remainingQty -= fillQty;
            bid.quantity -= fillQty;

            if (remainingQty <= 0) break;
         }

         const remainingOrders = ordersAtPrice.filter(
            (bid) => bid.quantity > 0,
         );
         if (remainingOrders.length > 0)
            this.bids.set(bidPrice, remainingOrders);
         else this.bids.delete(bidPrice);
      }

      return { fills, executedQty: order.quantity - remainingQty };
   }

   private insertOrder(order: Order) {
      const priceMap = order.side === 'buy' ? this.bids : this.asks;
      const ordersAtPrice = priceMap.get(order.price) || [];

      //  Insert order at price level
      ordersAtPrice.push(order);
      priceMap.set(order.price, ordersAtPrice);
   }

   private createFill(order: Order, price: number, qty: number): Fill {
      return {
         price,
         qty,
         tradeId: ++this.lastTradeId,
         otherUserId: order.userId,
         markerOrderId: order.orderId,
      };
   }

   private groupOrdersByPrice(
      orders: Order[],
      sortOrder: 'asc' | 'desc',
   ): Map<number, Order[]> {
      const priceMap = new Map<number, Order[]>();

      // Group orders by price
      orders.forEach((order) => {
         const priceLevel = priceMap.get(order.price) || [];
         priceLevel.push(order);
         priceMap.set(order.price, priceLevel);
      });

      // Convert to sorted array of entries
      const sortedEntries = Array.from(priceMap.entries()).sort((a, b) =>
         sortOrder === 'desc' ? b[0] - a[0] : a[0] - b[0],
      );

      // Rebuild Map to preserve sort order (JavaScript Maps iterate in insertion order)
      const sortedMap = new Map<number, Order[]>();
      sortedEntries.forEach(([price, orders]) => {
         sortedMap.set(price, orders);
      });

      return sortedMap;
   }
}
