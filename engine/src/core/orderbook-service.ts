import { QUOTE_ASSET } from '../utils/constants';
import { Fill, Order } from '../utils/types';

export class OrderBookService {
   private bids = new Map<number, Order[]>(); // price => orders (sorted high to low)
   private asks = new Map<number, Order[]>(); // price => orders (sorted low to high)
   public readonly quoteAsset = QUOTE_ASSET; // Constant value

   constructor(
      public readonly baseAsset: string,
      initialBids: Order[] = [],
      initialAsks: Order[] = [],
      public lastTradeId: number = 125
   ) {
      console.log('OrderBookService initialized');
      console.log('initialBids:', initialBids);
      this.initializeBook(initialBids, initialAsks);
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

   cancelOrder(orderId: string): boolean {
      return this.cancelBid(orderId) || this.cancelAsk(orderId);
   }

   getDepth(): { bids: [number, number][]; asks: [number, number][] } {
      const aggregate = (map: Map<number, Order[]>) => {
         const result = new Map<number, number>();
         for (const [price, orders] of map) {
            result.set(
               price,
               orders.reduce((sum, o) => sum + o.quantity, 0)
            );
         }
         return Array.from(result.entries());
      };

      return {
         bids: aggregate(this.bids).sort((a, b) => b[0] - a[0]), // High to low
         asks: aggregate(this.asks).sort((a, b) => a[0] - b[0]), // Low to high
      };
   }

   private matchBid(order: Order): { fills: Fill[]; executedQty: number } {
      const fills: Fill[] = [];
      let remainingQty = order.quantity;

      const askPrices = Array.from(this.asks.keys()).sort((a, b) => a - b);
      for (const askPrice of askPrices) {
         if (askPrice > order.price || remainingQty <= 0) break;

         const ordersAtPrice = this.asks.get(askPrice)!;
         for (const ask of ordersAtPrice) {
            const fillQty = Math.min(remainingQty, ask.quantity);
            fills.push(this.createFill(ask, askPrice, fillQty));
            remainingQty -= fillQty;
            ask.quantity -= fillQty;

            if (remainingQty <= 0) break;
         }

         // Clean up filled orders
         this.asks.set(
            askPrice,
            ordersAtPrice.filter((ask) => ask.quantity > 0)
         );
         if (this.asks.get(askPrice)?.length === 0) this.asks.delete(askPrice);
      }

      return { fills, executedQty: order.quantity - remainingQty };
   }

   private matchAsk(order: Order): { fills: Fill[]; executedQty: number } {
      const fills: Fill[] = [];
      let remainingQty = order.quantity;

      const bidPrices = Array.from(this.bids.keys()).sort((a, b) => b - a); // High to low
      for (const bidPrice of bidPrices) {
         if (bidPrice < order.price || remainingQty <= 0) break;

         const ordersAtPrice = this.bids.get(bidPrice)!;
         for (const bid of ordersAtPrice) {
            const fillQty = Math.min(remainingQty, bid.quantity);
            fills.push(this.createFill(bid, bidPrice, fillQty));
            remainingQty -= fillQty;
            bid.quantity -= fillQty;

            if (remainingQty <= 0) break;
         }

         // Clean up filled orders
         this.bids.set(
            bidPrice,
            ordersAtPrice.filter((bid) => bid.quantity > 0)
         );
         if (this.bids.get(bidPrice)?.length === 0) this.bids.delete(bidPrice);
      }

      return { fills, executedQty: order.quantity - remainingQty };
   }

   private insertOrder(order: Order) {
      const priceMap = order.side === 'buy' ? this.bids : this.asks;
      const ordersAtPrice = priceMap.get(order.price) || [];
      ordersAtPrice.push(order);
      priceMap.set(order.price, ordersAtPrice);
   }

   private cancelBid(orderId: string): boolean {
      return this.removeOrder(this.bids, orderId);
   }

   private cancelAsk(orderId: string): boolean {
      return this.removeOrder(this.asks, orderId);
   }

   private removeOrder(
      priceMap: Map<number, Order[]>,
      orderId: string
   ): boolean {
      for (const [price, orders] of priceMap) {
         const filtered = orders.filter((o) => o.orderId !== orderId);
         if (filtered.length !== orders.length) {
            priceMap.set(price, filtered);
            if (filtered.length === 0) priceMap.delete(price);
            return true;
         }
      }
      return false;
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

   private initializeBook(initialBids: Order[], initialAsks: Order[]) {
      initialBids.forEach((order) => this.insertOrder(order));
      initialAsks.forEach((order) => this.insertOrder(order));
   }

   // For snapshot serialization
   getBidsMap(): Map<number, Order[]> {
      return new Map(this.bids); // Return a copy
   }

   getAsksMap(): Map<number, Order[]> {
      return new Map(this.asks);
   }

   // For snapshot deserialization
   initialize(bids: Order[], asks: Order[], lastTradeId: number) {
      this.bids = this.groupOrders(bids);
      this.asks = this.groupOrders(asks);
      this.lastTradeId = lastTradeId;
   }

   private groupOrders(orders: Order[]): Map<number, Order[]> {
      const map = new Map<number, Order[]>();
      orders.forEach((order) => {
         const priceLevel = map.get(order.price) || [];
         priceLevel.push(order);
         map.set(order.price, priceLevel);
      });
      return map;
   }
}
