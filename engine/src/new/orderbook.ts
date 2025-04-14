import { Order, OrderSide, Trade } from './types';

export class OrderBook {
   private buyOrders: Order[] = [];
   private sellOrders: Order[] = [];

   addOrder(order: Order): Trade[] {
      const trades: Trade[] = [];

      if (order.side === OrderSide.BUY) {
         trades.push(...this.matchBuy(order));
         if (order.quantity > 0) this.insertOrder(this.buyOrders, order, true);
      } else {
         trades.push(...this.matchSell(order));
         if (order.quantity > 0)
            this.insertOrder(this.sellOrders, order, false);
      }

      return trades;
   }

   private matchBuy(order: Order): Trade[] {
      const trades: Trade[] = [];

      while (order.quantity > 0 && this.sellOrders.length > 0) {
         const bestSell = this.sellOrders[0];
         if (order.price < bestSell.price) break;

         const tradeQty = Math.min(order.quantity, bestSell.quantity);
         trades.push({
            price: bestSell.price,
            quantity: tradeQty,
            buyOrderId: order.id,
            sellOrderId: bestSell.id,
         });

         order.quantity -= tradeQty;
         bestSell.quantity -= tradeQty;

         if (bestSell.quantity === 0) this.sellOrders.shift();
      }

      return trades;
   }

   private matchSell(order: Order): Trade[] {
      const trades: Trade[] = [];

      while (order.quantity > 0 && this.buyOrders.length > 0) {
         const bestBuy = this.buyOrders[0];
         if (order.price > bestBuy.price) break;

         const tradeQty = Math.min(order.quantity, bestBuy.quantity);
         trades.push({
            price: bestBuy.price,
            quantity: tradeQty,
            buyOrderId: bestBuy.id,
            sellOrderId: order.id,
         });

         order.quantity -= tradeQty;
         bestBuy.quantity -= tradeQty;

         if (bestBuy.quantity === 0) this.buyOrders.shift();
      }

      return trades;
   }

   private insertOrder(orders: Order[], order: Order, isBuy: boolean) {
      const index = orders.findIndex((o) =>
         isBuy ? order.price > o.price : order.price < o.price,
      );
      if (index === -1) orders.push(order);
      else orders.splice(index, 0, order);
   }

   getOrderBook() {
      return {
         buy: [...this.buyOrders],
         sell: [...this.sellOrders],
      };
   }
}
