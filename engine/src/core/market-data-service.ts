import { Fill, On_Ramp, Order, OrderPlaced } from '../utils/types';
import { OrderBookService } from './orderbook-service';
import { RedisPublisher } from './redis-publisher';

export class MarketDataService {
   constructor(private orderbooks: OrderBookService[]) {}

   // Send messages to clients
   sendOrderPlaced(clientId: string, order: OrderPlaced) {
      RedisPublisher.getInstance().sendToClient(clientId, {
         type: 'ORDER_PLACED',
         payload: order,
      });
   }

   sendOrderCancelled(clientId: string, orderId: string) {
      RedisPublisher.getInstance().sendToClient(clientId, {
         type: 'ORDER_CANCELLED',
         payload: { orderId },
      });
   }

   sendError(clientId: string, message: string, error: any) {
      RedisPublisher.getInstance().sendToClient(clientId, {
         type: message,
         payload: error,
      });
   }

   sendDepth(market: string, clientId: string) {
      const orderbook = this.getOrderBook(market);
      const { bids, asks } = orderbook.getDepth();
      const payload = {
         type: 'DEPTH',
         payload: {
            bids: this.formatPaisaToRupeeLevels(bids),
            asks: this.formatPaisaToRupeeLevels(asks),
            timestamp: Date.now(),
         },
      };

      RedisPublisher.getInstance().sendToClient(clientId, payload);
   }

   sendOnRampSuccess(clientId: string, data: On_Ramp['data']): void {
      const payload = {
         type: 'ON_RAMP_SUCCESS',
         payload: {
            amount: data.quantity,
            asset: data.asset,
            timestamp: Date.now(),
         },
      };

      RedisPublisher.getInstance().sendToClient(clientId, payload);
   }

   sendOnRampFailure(clientId: string, data: On_Ramp['data']): void {
      const payload = {
         type: 'ON_RAMP_FAILED',
         payload: {
            amount: data.quantity,
            asset: data.asset,
            timestamp: Date.now(),
         },
      };

      RedisPublisher.getInstance().sendToClient(clientId, payload);
   }

   sendOpenOrders(clientId: string, orders: Order[]) {
      RedisPublisher.getInstance().sendToClient(clientId, {
         type: 'OPEN_ORDERS',
         payload: orders.map((o) => ({
            id: o.orderId,
            price: (o.price / 100).toFixed(2),
            quantity: o.quantity.toFixed(2),
            side: o.side,
         })),
      });
   }

   sendUserBalance(clientId: string, data) {
      RedisPublisher.getInstance().sendToClient(clientId, data);
   }

   // Send messages to WebSocket
   publishDepthUpdate(
      market: string,
      side: string,
      price: number,
      fills: Fill[] = [],
   ) {
      const orderbook = this.getOrderBook(market);
      const depth = orderbook.getDepth();

      // No specific updates - send full depth
      if (!fills.length) {
         RedisPublisher.getInstance().sendToWs(`depth.1000ms.${market}`, {
            stream: 'depth',
            data: {
               a: this.formatPaisaToRupeeLevels(depth.asks),
               b: this.formatPaisaToRupeeLevels(depth.bids),
               e: 'depth',
               t: Date.now(),
            },
         });
         return;
      }

      // Handle specific updates
      const fillPrices = fills.map((f) => f.price);

      const updates = {
         a: [] as [string, string][],
         b: [] as [string, string][],
         e: 'depth' as const,
         t: Date.now(),
      };

      if (side === 'buy') {
         // Update asks that were matched
         updates.a = this.formatPaisaToRupeeLevels(
            depth.asks.filter((level) => fillPrices.includes(level[0])),
         );

         // Add new bid level if exists
         if (price) {
            const bidLevel = depth.bids.find((level) => level[0] === price);
            if (bidLevel) {
               updates.b = this.formatPaisaToRupeeLevels([bidLevel]);
            }
         }
      }

      if (side === 'sell') {
         // Update bids that were matched
         updates.b = this.formatPaisaToRupeeLevels(
            depth.bids.filter((level) => fillPrices.includes(level[0])),
         );

         // Add new ask level if exists
         if (price) {
            const askLevel = depth.asks.find((level) => level[0] === price);
            if (askLevel) {
               updates.a = this.formatPaisaToRupeeLevels([askLevel]);
            }
         }
      }

      RedisPublisher.getInstance().sendToWs(`depth.1000ms.${market}`, {
         stream: 'depth',
         data: updates,
      });
   }

   publishTrades(userId: string, market: string, fills: Fill[]) {
      fills.forEach((fill) => {
         RedisPublisher.getInstance().sendToWs(`trade.${market}`, {
            stream: `trade.${market}`,
            data: {
               e: 'trade',
               t: fill.tradeId,
               m: fill.otherUserId === userId, // TODO: Is this right?
               p: fill.price,
               q: fill.quantity,
               s: market,
            },
         });
      });
   }

   // helpers
   private getOrderBook(market: string) {
      const orderbook = this.orderbooks.find((o) => o.ticker() === market);
      if (!orderbook) throw new Error('Orderbook not found');
      return orderbook;
   }

   private formatPaisaToRupeeLevels(
      levels: [number, number][],
   ): [string, string][] {
      return levels.map(([price, qty]) => [
         (price / 100).toFixed(2),
         qty.toFixed(2),
      ]);
   }
}
