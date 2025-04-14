import { OrderBook } from './orderbook';
import { RedisManager } from './redis-manager';
import { Order, OrderSide, Trade } from './types';

export class Engine {
   private orderBook = new OrderBook();
   private redis = new RedisManager();

   async process(order: Order): Promise<Trade[]> {
      if (!(await this.hasSufficientBalance(order))) {
         throw new Error('Insufficient balance');
      }

      const trades = this.orderBook.addOrder(order);
      await this.applyTrades(trades, order.side);

      if (order.quantity > 0) {
         await this.lockFunds(order); // lock remaining funds
      }

      return trades;
   }

   private async hasSufficientBalance(order: Order): Promise<boolean> {
      const userBalance = await this.redis.getBalance(
         order.userId,
         this.getRequiredAsset(order),
      );
      const required = this.calculateRequiredFunds(order);
      return userBalance >= required;
   }

   private calculateRequiredFunds(order: Order): number {
      return order.side === OrderSide.BUY
         ? order.quantity * order.price
         : order.quantity;
   }

   private getRequiredAsset(order: Order): string {
      return order.side === OrderSide.BUY ? order.quoteAsset : order.baseAsset;
   }

   private async lockFunds(order: Order): Promise<void> {
      const asset = this.getRequiredAsset(order);
      const amount = this.calculateRequiredFunds(order);
      await this.redis.decreaseBalance(order.userId, asset, amount);
   }

   private async applyTrades(
      trades: Trade[],
      takerSide: OrderSide,
   ): Promise<void> {
      for (const trade of trades) {
         const baseQty = trade.quantity;
         const quoteQty = trade.price * trade.quantity;

         const [buyerId, sellerId] =
            takerSide === OrderSide.BUY
               ? [trade.buyOrderId, trade.sellOrderId]
               : [trade.sellOrderId, trade.buyOrderId];

         await this.redis.increaseBalance(buyerId, trade.baseAsset, baseQty);
         await this.redis.increaseBalance(sellerId, trade.quoteAsset, quoteQty);
      }
   }

   getOrderBook() {
      return this.orderBook.getOrderBook();
   }
}
