import { readFileSync, writeFileSync } from 'fs';
import { env } from '../env';
import { RedisManager } from '../redis-manager';
import { Fill, Order, ORDER_UPDATE, TRADE_ADDED, UserBalance } from '../types';
import { Orderbook } from './orderbook';

export const BASE_CURRENCY = 'INR';

export class Engine {
   private balances: Map<string, UserBalance> = new Map();
   private orderbooks: Orderbook[] = [];

   constructor() {
      // Initialize the engine
      let snapshot: string;
      try {
         if (env.WITH_SNAPSHOT) {
            snapshot = readFileSync('./snapshot.json', 'utf8');
         }
      } catch (error) {
         console.log('Error reading snapshot file');
      }

      if (snapshot) {
         const parsedSnapshot = JSON.parse(snapshot);
         this.balances = new Map<string, UserBalance>(
            Object.entries(parsedSnapshot.balances),
         );
         this.orderbooks = parsedSnapshot.orderbooks.map((orderbook: any) => {
            return new Orderbook(
               orderbook.lastTradeId,
               orderbook.currentPrice,
               orderbook.bids,
               orderbook.asks,
               orderbook.baseAsset,
            );
         });
      } else {
         this.orderbooks = [new Orderbook('USDC', [], [], 0, 0)];
         this.setBaseBalance();
      }
   }

   saveSnapshot() {
      const savedSnapshot = {
         orderbooks: this.orderbooks.map((o) => o.getSnapshot()),
         balances: Array.from(this.balances.entries()),
      };

      writeFileSync(
         './snapshot.json',
         JSON.stringify(savedSnapshot, null, 2),
         'utf8',
      );
      console.log('Snapshot saved');
   }

   process(message: any) {
      // Process the message
      console.log('Processing message:', message);
   }

   setBaseBalance() {
      this.balances.set('1', {
         [BASE_CURRENCY]: {
            available: 10000000,
            locked: 0,
         },
         TATA: {
            available: 10000000,
            locked: 0,
         },
      });

      this.balances.set('2', {
         [BASE_CURRENCY]: {
            available: 10000000,
            locked: 0,
         },
         TATA: {
            available: 10000000,
            locked: 0,
         },
      });

      this.balances.set('5', {
         [BASE_CURRENCY]: {
            available: 10000000,
            locked: 0,
         },
         TATA: {
            available: 10000000,
            locked: 0,
         },
      });
   }

   createOrder(
      market: string,
      price: string,
      quantity: string,
      side: 'buy' | 'sell',
      userId: string,
   ) {
      // Create an order

      const orderbook = this.orderbooks.find((o) => o.ticker() === market);
      const baseAsset = market.split('_')[0];
      const quoteAsset = market.split('_')[1];

      if (!orderbook) throw new Error('No orderbook found');

      this.checkAndLockFunds(
         baseAsset,
         quoteAsset,
         side,
         userId,
         quoteAsset,
         price,
         quantity,
      );

      const order = {
         price: parseFloat(price),
         quantity: parseFloat(quantity),
         orderId: `${userId}-${Date.now()}`,
         filled: 0,
         side,
         userId,
      };
      const { fills, executedQty } = orderbook.addOrder(order);

      this.updateBalance(
         userId,
         baseAsset,
         quoteAsset,
         side,
         fills,
         executedQty,
      );
      this.createDbTrades(fills, market, userId);
      this.updateDbOrders(order, executedQty, fills, market);
      this.publishWsDepthUpdates(fills, price, side, market);
      this.publishWsTrades(fills, userId, market);

      return { executedQty, fills, orderId: order.orderId };
   }

   updateDbOrders(
      order: Order,
      executedQty: number,
      fills: Fill[],
      market: string,
   ) {
      // Update an order in the database
      RedisManager.getInstance().pushMessage({
         type: ORDER_UPDATE,
         data: {
            orderId: order.orderId,
            executedQty: executedQty,
            market: market,
            price: order.price.toString(),
            quantity: order.quantity.toString(),
            side: order.side,
         },
      });

      fills.forEach((fill) => {
         RedisManager.getInstance().pushMessage({
            type: ORDER_UPDATE,
            data: {
               orderId: fill.markerOrderId,
               executedQty: fill.qty,
            },
         });
      });
   }

   updateBalance() {
      // Update the balance of a user
   }

   addOrderbook(orderbook: Orderbook) {
      // Add an orderbook to the engine
   }

   createDbTrades(fills: Fill[], userId: string, market: string) {
      // Create a trade in the database
      fills.forEach((fill) => {
         RedisManager.getInstance().pushMessage({
            type: TRADE_ADDED,
            data: {
               market,
               id: fill.tradeId.toString(),
               isBuyerMaker: fill.otherUserId === userId,
               price: fill.price,
               quantity: fill.qty.toString(),
               quoteQuantity: (fill.qty * Number(fill.price)).toString(),
               timestamp: Date.now(),
            },
         });
      });
   }

   publishWsTrades(fills: Fill[], userId: string, market: string) {
      // Publish a trade to the WebSocket

      fills.forEach((fill) => {
         RedisManager.getInstance().publishMessage(`trade@${market}`, {
            stream: `trade@${market}`,
            data: {
               e: 'trade',
               t: fill.tradeId,
               m: fill.otherUserId === userId, // TODO: Is this right?
               p: fill.price,
               q: fill.qty.toString(),
               s: market,
            },
         });
      });
   }

   publishWsDepthUpdates() {
      // Publish the updated depth to the WebSocket
   }

   sendUpdatedDepthAt() {
      // Send the updated depth at a specific time
   }

   checkAndLockFunds(
      baseAsset: string,
      quoteAsset: string,
      side: 'buy' | 'sell',
      userId: string,
      asset: string,
      price: string,
      quantity: string,
   ) {
      // Check and lock funds for an order
   }

   onRamp(userId: string, amount: number) {
      // Handle on-ramp transactions
   }
}
