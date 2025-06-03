import type {
   Fill,
   OnRamp,
   OrderSide
} from '@suitcase/shared-types/messages/api-engine';
import type { Order, UserBalance } from '../utils/types';
import { OrderBookService } from './orderbook-service';
import { RedisService } from './redis-service';

export class MarketDataService {
   constructor(private orderbooks: OrderBookService[]) {}

   updateOrderbooks(orderbooks: OrderBookService[]) {
      this.orderbooks = orderbooks;
   }

   // Send messages to clients
   sendOrderPlaced(
      clientId: string,
      order: { fills: Fill[]; orderId: number; executedQty: number }
   ) {
      RedisService.getInstance().sendToClient(clientId, {
         type: 'ORDER_PLACED',
         payload: order
      });
   }

   sendOrderCancelled(clientId: string, orderId: string) {
      RedisService.getInstance().sendToClient(clientId, {
         type: 'ORDER_CANCELLED',
         payload: { orderId }
      });
   }

   sendDepth(market: string, clientId: string) {
      const orderbook = this.getOrderBook(market);
      const { bids, asks } = orderbook.getDepth();

      RedisService.getInstance().sendToClient(clientId, {
         type: 'DEPTH',
         payload: {
            bids: this.formatPaisaToRupeeLevels(bids),
            asks: this.formatPaisaToRupeeLevels(asks),
            timestamp: Date.now()
         }
      });
   }

   sendOnRampSuccess(clientId: string, data: OnRamp['data']): void {
      RedisService.getInstance().sendToClient(clientId, {
         type: 'ON_RAMP_SUCCESS',
         payload: {
            amount: data.quantity,
            asset: data.asset,
            timestamp: Date.now()
         }
      });
   }

   sendOpenOrders(clientId: string, orders: Order[]) {
      RedisService.getInstance().sendToClient(clientId, {
         type: 'OPEN_ORDERS',
         payload: orders.map((o) => ({
            id: o.orderId,
            price: (o.price / 100).toFixed(2),
            quantity: o.quantity.toFixed(2),
            side: o.side
         }))
      });
   }

   sendUserBalance(clientId: string, data: UserBalance) {
      RedisService.getInstance().sendToClient(clientId, {
         type: 'USER_BALANCE',
         payload: data
      });
   }

   sendAddNewUserSuccess(clientId: string, userId: string) {
      RedisService.getInstance().sendToClient(clientId, {
         type: 'ADD_NEW_USER_SUCCESS',
         payload: { userId }
      });
   }

   sendUserAlreadyExists(clientId: string, userId: string) {
      RedisService.getInstance().sendToClient(clientId, {
         type: 'USER_ALREADY_EXISTS',
         payload: { userId }
      });
   }

   // Send messages to WebSocket
   publishDepthUpdate(
      market: string,
      updatedDepth: {
         a: [number, number][];
         b: [number, number][];
      }
   ) {
      RedisService.getInstance().sendToWs(`depth.1000ms.${market}`, {
         stream: 'depth',
         data: {
            a: this.formatPaisaToRupeeLevels(updatedDepth.a),
            b: this.formatPaisaToRupeeLevels(updatedDepth.b),
            e: 'depth'
         }
      });
   }

   publishTrades(market: string, side: OrderSide, fills: Fill[]) {
      fills.forEach((fill) => {
         RedisService.getInstance().sendToWs(`trade.${market}`, {
            stream: `trade.${market}`,
            data: {
               e: 'trade',
               T: Date.now() * 1000,
               m: side === 'sell',
               p: (fill.price / 100).toFixed(2),
               q: String(fill.quantity),
               s: market
            }
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
      levels: [number, number][]
   ): [string, string][] {
      return levels.map(([price, qty]) => [
         (price / 100).toFixed(2),
         qty.toFixed(2)
      ]);
   }
}
