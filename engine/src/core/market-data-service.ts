import { RedisPublisher } from './redis-publisher';

export class MarketDataService {
   constructor(private orderbooks: OrderBook[]) {}

   sendDepth(market: string, clientId: string) {
      const orderbook = this.getOrderBook(market);
      const depth = orderbook.getDepth();

      // Convert paisa → rupees only here
      const formattedBids = depth.bids.map(([price, qty]) => [
         (price / 100).toFixed(2),
         qty.toFixed(2),
      ]);

      RedisPublisher.sendDepth(clientId, formattedBids);
   }

   getOpenOrders(userId: string, market: string) {
      return this.getOrderBook(market).getOpenOrders(userId);
   }
}
