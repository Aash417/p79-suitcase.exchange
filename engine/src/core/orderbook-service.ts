import { QUOTE_ASSET } from '../utils/constants';
import { Fill, Order, ORDER_SIDE } from '../utils/types';

export class OrderBookService {
   private bids = new Map<number, Order[]>(); // price => orders (sorted high to low)
   private asks = new Map<number, Order[]>(); // price => orders (sorted low to high)
   public readonly quoteAsset = QUOTE_ASSET;
   public lastTradeId: number = 125;

   constructor(public readonly baseAsset: string) {}

   // For snapshot deserialization
   initialize(bids: Order[], asks: Order[], lastTradeId: number) {
      this.bids = this.groupOrdersByPrice(bids, 'desc');
      this.asks = this.groupOrdersByPrice(asks, 'asc');
      this.lastTradeId = lastTradeId;
   }

   // For snapshot serialization
   getBidsMap(): Map<number, Order[]> {
      return new Map(this.bids);
   }

   getAsksMap(): Map<number, Order[]> {
      return new Map(this.asks);
   }

   ticker() {
      return `${this.baseAsset}_${this.quoteAsset}`; // SOL_USDC
   }

   addOrder(order: Order) {
      const isBuy = order.side === 'buy';
      const { fills, executedQty, affectedPrice } = isBuy
         ? this.matchBid(order)
         : this.matchAsk(order);

      const remainingQty = order.quantity - executedQty;

      const updatedAsks = isBuy
         ? affectedPrice
         : remainingQty > 0
           ? [[order.price, remainingQty]]
           : [];

      const updatedBids = isBuy
         ? remainingQty > 0
            ? [[order.price, remainingQty]]
            : []
         : affectedPrice;

      const updatedDepth = {
         a: updatedAsks,
         b: updatedBids,
      } as { a: [number, number][]; b: [number, number][] };

      if (remainingQty > 0) {
         this.insertOrder({
            ...order,
            quantity: remainingQty,
         });
      }

      return { orderId: ++this.lastTradeId, fills, executedQty, updatedDepth };
   }

   cancelOrder(orderId: string, side: ORDER_SIDE): boolean {
      if (side === 'buy') return this.cancelBid(orderId);
      else return this.cancelAsk(orderId);
   }

   getDepth(): {
      bids: [number, number][]; // [priceInPaisa, quantity]
      asks: [number, number][];
   } {
      return {
         bids: this.aggregatePriceLevels(this.bids, 'asc'),
         asks: this.aggregatePriceLevels(this.asks, 'asc'),
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

   getOpenOrders(userId: string): Order[] {
      const isUserOrder = (o: Order) =>
         o.userId === userId && o.quantity > o.filled;

      return [
         ...this.getOrdersFromMap(this.bids, isUserOrder),
         ...this.getOrdersFromMap(this.asks, isUserOrder),
      ];
   }

   private getOrdersFromMap(
      priceMap: Map<number, Order[]>,
      filterFn: (o: Order) => boolean,
   ): Order[] {
      return Array.from(priceMap.values()).flat().filter(filterFn);
   }

   private aggregatePriceLevels(
      priceMap: Map<number, Order[]>,
      sortOrder: 'asc' | 'desc',
   ): [number, number][] {
      // 1. Aggregate quantities per price level
      const aggregated = new Map<number, number>();
      for (const [price, orders] of priceMap) {
         aggregated.set(
            price,
            orders.reduce((sum, o) => sum + o.quantity, 0),
         );
      }

      // 2. Sort and return as array
      return Array.from(aggregated.entries()).sort((a, b) =>
         sortOrder === 'desc' ? b[0] - a[0] : a[0] - b[0],
      );
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

   private matchBid(order: Order): {
      fills: Fill[];
      executedQty: number;
      affectedPrice: [number, number][];
   } {
      const fills: Fill[] = [];
      let remainingQty = order.quantity;
      const affectedPrice: [number, number][] = [];

      // 1. Iterate asks from lowest to highest price (Map keys are already sorted)
      for (const [askPrice, ordersAtPrice] of this.asks) {
         // 2. Stop if no more possible matches
         if (askPrice > order.price || remainingQty <= 0) break;

         // 3. Match against all orders at this price level
         for (const ask of ordersAtPrice) {
            // Skip orders from the same user
            if (ask.userId === order.userId) continue;

            const fillQty = Math.min(remainingQty, ask.quantity);
            fills.push(this.createFill(ask, askPrice, fillQty));
            remainingQty -= fillQty;
            ask.quantity -= fillQty;

            // Track affected ask (record new quantity after fill)
            affectedPrice.push([askPrice, ask.quantity]);

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

      return {
         fills,
         executedQty: order.quantity - remainingQty,
         affectedPrice,
      };
   }

   private matchAsk(order: Order): {
      fills: Fill[];
      executedQty: number;
      affectedPrice: [number, number][];
   } {
      const fills: Fill[] = [];
      let remainingQty = order.quantity;
      const affectedPrice: [number, number][] = [];

      for (const [bidPrice, ordersAtPrice] of this.bids) {
         if (bidPrice < order.price || remainingQty <= 0) break;

         for (const bid of ordersAtPrice) {
            if (bid.userId === order.userId) continue;

            const fillQty = Math.min(remainingQty, bid.quantity);
            fills.push(this.createFill(bid, bidPrice, fillQty));
            remainingQty -= fillQty;
            bid.quantity -= fillQty;

            affectedPrice.push([bidPrice, bid.quantity]);

            if (remainingQty <= 0) break;
         }

         const remainingOrders = ordersAtPrice.filter(
            (bid) => bid.quantity > 0,
         );
         if (remainingOrders.length > 0)
            this.bids.set(bidPrice, remainingOrders);
         else this.bids.delete(bidPrice);
      }

      return {
         fills,
         executedQty: order.quantity - remainingQty,
         affectedPrice,
      };
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
         quantity: qty,
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
