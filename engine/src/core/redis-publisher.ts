import { RedisClientType, createClient } from 'redis';
import { OrderPlaced } from '../utils/types';

type WsMessage = {
   stream: string;
   data: Record<string, any>;
};

type ApiMessage = {
   type: string;
   payload: any;
};

type DbMessage = {
   type: string;
   data: any;
};

export class RedisPublisher {
   private static instance: RedisPublisher;
   private client: RedisClientType;

   private constructor() {
      this.client = createClient();
      this.client.connect();
   }

   // --- Singleton Access ---
   static getInstance(): RedisPublisher {
      if (!this.instance) {
         this.instance = new RedisPublisher();
      }
      return this.instance;
   }

   // --- Core Methods ---
   publishTrade(trade: TradeEvent) {
      this.client.publish(
         `trade@${trade.market}`,
         JSON.stringify({
            stream: `trade@${trade.market}`,
            data: {
               e: 'trade',
               t: trade.tradeId,
               p: trade.price,
               q: trade.quantity.toString(),
               s: trade.market,
            },
         }),
      );
   }

   publishDepth(market: string, depth: DepthUpdate) {
      this.client.publish(
         `depth@${market}`,
         JSON.stringify({
            stream: `depth@${market}`,
            data: {
               e: 'depth',
               a: depth.asks, // Formatted asks ([price, qty][])
               b: depth.bids, // Formatted bids ([price, qty][])
            },
         }),
      );
   }

   sendToClient(clientId: string, message: ApiMessage) {
      this.client.publish(clientId, JSON.stringify(message));
   }

   queueDbMessage(message: DbMessage) {
      this.client.lPush('db_processor', JSON.stringify(message));
   }

   // --- Helper Methods ---
   sendOrderPlaced(clientId: string, order: OrderPlaced) {
      this.sendToClient(clientId, {
         type: 'ORDER_PLACED',
         payload: order,
      });
   }

   sendOrderCancelled(clientId: string, orderId: string) {
      this.sendToClient(clientId, {
         type: 'ORDER_CANCELLED',
         payload: { orderId },
      });
   }

   sendError(clientId: string, message: string, error: any) {
      this.sendToClient(clientId, {
         type: message,
         payload: error,
      });
   }
}
