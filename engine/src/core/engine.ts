import { readFileSync, writeFileSync } from 'fs';
import { env } from '../env';
import { UserBalance } from '../types';
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
}
