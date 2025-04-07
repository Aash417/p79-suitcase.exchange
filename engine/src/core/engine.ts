import { readFileSync, writeFileSync } from 'fs';
import { env } from '../env';
import { RedisManager } from '../redis-manager';
import {
   CANCEL_ORDER,
   CREATE_ORDER,
   Fill,
   GET_DEPTH,
   GET_OPEN_ORDERS,
   MessageFromApi,
   ON_RAMP,
   Order,
   ORDER_UPDATE,
   TRADE_ADDED,
   UserBalance,
} from '../types';
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

      writeFileSync('./snapshot.json', JSON.stringify(savedSnapshot), 'utf8');
      console.log('Snapshot saved');
   }

   process({
      message,
      clientId,
   }: {
      message: MessageFromApi;
      clientId: string;
   }) {
      // Process the message
      switch (message.type) {
         case CREATE_ORDER:
            try {
               const { executedQty, fills, orderId } = this.createOrder(
                  message.data.market,
                  message.data.price,
                  message.data.quantity,
                  message.data.side,
                  message.data.userId,
               );
               RedisManager.getInstance().sendToApi(clientId, {
                  type: 'ORDER_PLACED',
                  payload: {
                     orderId,
                     executedQty,
                     fills,
                  },
               });
            } catch (e) {
               console.log(e);
               RedisManager.getInstance().sendToApi(clientId, {
                  type: 'ORDER_CANCELLED',
                  payload: {
                     orderId: '',
                     executedQty: 0,
                     remainingQty: 0,
                  },
               });
            }
            break;
         case CANCEL_ORDER:
            try {
               const orderId = message.data.orderId;
               const cancelMarket = message.data.market;
               const cancelOrderbook = this.orderbooks.find(
                  (o) => o.ticker() === cancelMarket,
               );
               const quoteAsset = cancelMarket.split('_')[1];
               if (!cancelOrderbook) {
                  throw new Error('No orderbook found');
               }

               const order =
                  cancelOrderbook.asks.find((o) => o.orderId === orderId) ||
                  cancelOrderbook.bids.find((o) => o.orderId === orderId);
               if (!order) {
                  console.log('No order found');
                  throw new Error('No order found');
               }

               if (order.side === 'buy') {
                  const price = cancelOrderbook.cancelBid(order);
                  const leftQuantity =
                     (order.quantity - order.filled) * order.price;
                  //@ts-ignore
                  this.balances.get(order.userId)[BASE_CURRENCY].available +=
                     leftQuantity;
                  //@ts-ignore
                  this.balances.get(order.userId)[BASE_CURRENCY].locked -=
                     leftQuantity;
                  if (price) {
                     this.sendUpdatedDepthAt(price.toString(), cancelMarket);
                  }
               } else {
                  const price = cancelOrderbook.cancelAsk(order);
                  const leftQuantity = order.quantity - order.filled;
                  //@ts-ignore
                  this.balances.get(order.userId)[quoteAsset].available +=
                     leftQuantity;
                  //@ts-ignore
                  this.balances.get(order.userId)[quoteAsset].locked -=
                     leftQuantity;
                  if (price) {
                     this.sendUpdatedDepthAt(price.toString(), cancelMarket);
                  }
               }

               RedisManager.getInstance().sendToApi(clientId, {
                  type: 'ORDER_CANCELLED',
                  payload: {
                     orderId,
                     executedQty: 0,
                     remainingQty: 0,
                  },
               });
            } catch (e) {
               console.log('Error hwile cancelling order');
               console.log(e);
            }
            break;
         case GET_OPEN_ORDERS:
            try {
               const openOrderbook = this.orderbooks.find(
                  (o) => o.ticker() === message.data.market,
               );
               if (!openOrderbook) {
                  throw new Error('No orderbook found');
               }
               const openOrders = openOrderbook.getOpenOrders(
                  message.data.userId,
               );

               RedisManager.getInstance().sendToApi(clientId, {
                  type: 'OPEN_ORDERS',
                  payload: openOrders,
               });
            } catch (e) {
               console.log(e);
            }
            break;
         case ON_RAMP:
            const userId = message.data.userId;
            const amount = Number(message.data.amount);
            this.onRamp(userId, amount);
            break;
         case GET_DEPTH:
            try {
               const market = message.data.market;
               const orderbook = this.orderbooks.find(
                  (o) => o.ticker() === market,
               );
               if (!orderbook) {
                  throw new Error('No orderbook found');
               }
               RedisManager.getInstance().sendToApi(clientId, {
                  type: 'DEPTH',
                  payload: orderbook.getDepth(),
               });
            } catch (e) {
               console.log(e);
               RedisManager.getInstance().sendToApi(clientId, {
                  type: 'DEPTH',
                  payload: {
                     bids: [],
                     asks: [],
                  },
               });
            }
            break;
      }
   }

   addOrderbook(orderbook: Orderbook) {
      // Add an orderbook to the engine
      this.orderbooks.push(orderbook);
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

   sendUpdatedDepthAt(price: string, market: string) {
      // Send the updated depth at a specific time
      const orderbook = this.orderbooks.find((o) => o.ticker() === market);
      if (!orderbook) {
         return;
      }
      const depth = orderbook.getDepth();
      const updatedBids = depth?.bids.filter((x) => x[0] === price);
      const updatedAsks = depth?.asks.filter((x) => x[0] === price);

      RedisManager.getInstance().publishMessage(`depth@${market}`, {
         stream: `depth@${market}`,
         data: {
            a: updatedAsks.length ? updatedAsks : [[price, '0']],
            b: updatedBids.length ? updatedBids : [[price, '0']],
            e: 'depth',
         },
      });
   }

   publishWsDepthUpdates(
      fills: Fill[],
      price: string,
      side: 'buy' | 'sell',
      market: string,
   ) {
      // Publish the updated depth to the WebSocket

      const orderbook = this.orderbooks.find((o) => o.ticker() === market);
      if (!orderbook) {
         return;
      }
      const depth = orderbook.getDepth();
      if (side === 'buy') {
         const updatedAsks = depth?.asks.filter((x) =>
            fills.map((f) => f.price).includes(x[0].toString()),
         );
         const updatedBid = depth?.bids.find((x) => x[0] === price);
         console.log('publish ws depth updates');
         RedisManager.getInstance().publishMessage(`depth@${market}`, {
            stream: `depth@${market}`,
            data: {
               a: updatedAsks,
               b: updatedBid ? [updatedBid] : [],
               e: 'depth',
            },
         });
      }
      if (side === 'sell') {
         const updatedBids = depth?.bids.filter((x) =>
            fills.map((f) => f.price).includes(x[0].toString()),
         );
         const updatedAsk = depth?.asks.find((x) => x[0] === price);
         console.log('publish ws depth updates');
         RedisManager.getInstance().publishMessage(`depth@${market}`, {
            stream: `depth@${market}`,
            data: {
               a: updatedAsk ? [updatedAsk] : [],
               b: updatedBids,
               e: 'depth',
            },
         });
      }
   }

   updateBalance(
      userId: string,
      baseAsset: string,
      quoteAsset: string,
      side: 'buy' | 'sell',
      fills: Fill[],
      executedQty: number,
   ) {
      // Update the balance of a user
      if (side === 'buy') {
         fills.forEach((fill) => {
            // Update quote asset balance
            //@ts-ignore
            this.balances.get(fill.otherUserId)[quoteAsset].available =
               this.balances.get(fill.otherUserId)?.[quoteAsset].available +
               fill.qty * fill.price;

            //@ts-ignore
            this.balances.get(userId)[quoteAsset].locked =
               this.balances.get(userId)?.[quoteAsset].locked -
               fill.qty * fill.price;

            // Update base asset balance

            //@ts-ignore
            this.balances.get(fill.otherUserId)[baseAsset].locked =
               this.balances.get(fill.otherUserId)?.[baseAsset].locked -
               fill.qty;

            //@ts-ignore
            this.balances.get(userId)[baseAsset].available =
               this.balances.get(userId)?.[baseAsset].available + fill.qty;
         });
      } else {
         fills.forEach((fill) => {
            // Update quote asset balance
            //@ts-ignore
            this.balances.get(fill.otherUserId)[quoteAsset].locked =
               this.balances.get(fill.otherUserId)?.[quoteAsset].locked -
               fill.qty * fill.price;

            //@ts-ignore
            this.balances.get(userId)[quoteAsset].available =
               this.balances.get(userId)?.[quoteAsset].available +
               fill.qty * fill.price;

            // Update base asset balance

            //@ts-ignore
            this.balances.get(fill.otherUserId)[baseAsset].available =
               this.balances.get(fill.otherUserId)?.[baseAsset].available +
               fill.qty;

            //@ts-ignore
            this.balances.get(userId)[baseAsset].locked =
               this.balances.get(userId)?.[baseAsset].locked - fill.qty;
         });
      }
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

      if (side === 'buy') {
         if (
            (this.balances.get(userId)?.[quoteAsset]?.available || 0) <
            Number(quantity) * Number(price)
         ) {
            throw new Error('Insufficient funds');
         }
         //@ts-ignore
         this.balances.get(userId)[quoteAsset].available =
            this.balances.get(userId)?.[quoteAsset].available -
            Number(quantity) * Number(price);

         //@ts-ignore
         this.balances.get(userId)[quoteAsset].locked =
            this.balances.get(userId)?.[quoteAsset].locked +
            Number(quantity) * Number(price);
      } else {
         if (
            (this.balances.get(userId)?.[baseAsset]?.available || 0) <
            Number(quantity)
         ) {
            throw new Error('Insufficient funds');
         }
         //@ts-ignore
         this.balances.get(userId)[baseAsset].available =
            this.balances.get(userId)?.[baseAsset].available - Number(quantity);

         //@ts-ignore
         this.balances.get(userId)[baseAsset].locked =
            this.balances.get(userId)?.[baseAsset].locked + Number(quantity);
      }
   }

   onRamp(userId: string, amount: number) {
      // Handle on-ramp transactions

      const userBalance = this.balances.get(userId);

      if (!userBalance) {
         this.balances.set(userId, {
            [BASE_CURRENCY]: {
               available: amount,
               locked: 0,
            },
         });
      } else {
         userBalance[BASE_CURRENCY].available += amount;
      }
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
}
