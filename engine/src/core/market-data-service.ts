import { OrderBookService } from './orderbook-service';
import { RedisPublisher } from './redis-publisher';

export class MarketDataService {
   constructor(private orderbooks: OrderBookService[]) {}

   sendDepth(market: string, clientId: string) {
      const orderbook = this.getOrderBook(market);

      const { bids, asks } = orderbook.getDepth();
      const payload = {
         bids: this.formatPaisaToRupeeLevels(bids),
         asks: this.formatPaisaToRupeeLevels(asks),
         timestamp: Date.now(),
      };

      RedisPublisher.getInstance().sendDepth(clientId, payload);
   }

   publishDepthUpdate(market: string) {
      const orderbook = this.getOrderBook(market);

      // 1. Get changed prices
      // const changedPrices = [...new Set(fills.map((f) => f.price))];

      // 2. Get current depth (full or delta)
      const { bids, asks } = orderbook.getDepth();

      const payload = {
         bids: this.formatPaisaToRupeeLevels(bids),
         asks: this.formatPaisaToRupeeLevels(asks),
         timestamp: Date.now(),
      };

      RedisPublisher.getInstance().publishDepthUpdate(market, payload);
   }

   private getOrderBook(market: string) {
      const orderbook = this.orderbooks.find((o) => o.ticker() === market);
      if (!orderbook) throw new Error('Orderbook not found');
      return orderbook;
   }

   private formatPaisaToRupeeLevels(
      levels: [number, number][],
   ): [string, string][] {
      return levels.map(([price, qty]) => [
         (price / 100).toFixed(2), // Convert paisa to currency
         qty.toFixed(2), // Format quantity
      ]);
   }
}
