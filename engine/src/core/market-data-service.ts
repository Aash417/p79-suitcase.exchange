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
      updatedDepth: {
         a: [number, number][];
         b: [number, number][];
      },
   ) {
      RedisPublisher.getInstance().sendToWs(`depth.1000ms.${market}`, {
         stream: 'depth',
         data: {
            a: this.formatPaisaToRupeeLevels(updatedDepth.a),
            b: this.formatPaisaToRupeeLevels(updatedDepth.b),
            e: 'depth',
            t: Date.now(),
         },
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
