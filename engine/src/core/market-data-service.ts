import { OrderBookService } from './orderbook-service';
import { RedisPublisher } from './redis-publisher';

export class MarketDataService {
   constructor(private orderbooks: OrderBookService[]) {}

   sendDepth(market: string, clientId: string) {
      const orderbook = this.orderbooks.find((ob) => ob.ticker() === market);
      if (!orderbook) return;

      const { bids, asks } = orderbook.getDepth();
      const payload = {
         bids: this.formatPaisaToRupeeLevels(bids),
         asks: this.formatPaisaToRupeeLevels(asks),
         timestamp: Date.now(),
      };

      RedisPublisher.getInstance().sendDepth(clientId, payload);
   }

   // getOpenOrders(userId: string, market: string) {
   //    return this.getOrderBook(market).getOpenOrders(userId);
   // }

   private formatPaisaToRupeeLevels(
      levels: [number, number][],
   ): [string, string][] {
      return levels.map(([price, qty]) => [
         (price / 100).toFixed(2), // Convert paisa to currency
         qty.toFixed(2), // Format quantity
      ]);
   }
}
