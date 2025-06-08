import prisma from '@repo/database';
import { readFileSync, writeFileSync } from 'node:fs';
import { SNAPSHOT_PATH } from '../utils/constants';
import type { Order, UserBalance } from '../utils/types';
import { BalanceService } from './balance-service';
import { OrderBookService } from './orderbook-service';

type Snapshot = {
   orderbooks: {
      baseAsset: string;
      bids: Order[];
      asks: Order[];
      lastTradeId: number;
   }[];
   balances: [string, UserBalance][];
};

export class SnapshotService {
   constructor(
      private orderbooks: OrderBookService[],
      private readonly balanceService: BalanceService,
      private readonly setOrderbooks?: (orderbooks: OrderBookService[]) => void
   ) {}

   save() {
      try {
         const snapshot: Snapshot = {
            orderbooks: this.orderbooks.map((ob) => ({
               baseAsset: ob.baseAsset,
               bids: this.getOrdersFromMap(ob.getBidsMap()), // Convert Map<price, Order[]> => Order[]
               asks: this.getOrdersFromMap(ob.getAsksMap()),
               lastTradeId: ob.lastTradeId
            })),
            balances: Array.from(this.balanceService.getBalances().entries())
         };

         writeFileSync(
            './backupSnapshot.json',
            JSON.stringify(snapshot, null, 2)
         );
         return true;
      } catch (error) {
         console.error('Snapshot save failed:', error);
         return false;
      }
   }

   async load() {
      try {
         const data = readFileSync(SNAPSHOT_PATH, 'utf-8');
         const snapshot = JSON.parse(data) as Snapshot;

         const loadedOrderbooks = snapshot.orderbooks.map(
            (obData) =>
               new OrderBookService(obData.baseAsset, obData.bids, obData.asks)
         );

         // Update the reference in Engine
         if (this.setOrderbooks) {
            this.setOrderbooks(loadedOrderbooks);
            this.orderbooks = loadedOrderbooks;
         }
         const newUsers = await this.initiateUserFromDb();

         this.balanceService.setBalances(
            new Map([...snapshot.balances, ...newUsers])
         );

         console.log('Snapshot loaded successfully');
         return true;
      } catch (error) {
         console.error('Snapshot load failed:', error);
         return false;
      }
   }

   private getOrdersFromMap(priceMap: Map<number, Order[]>): Order[] {
      return Array.from(priceMap.values()).flat();
   }

   async initiateUserFromDb() {
      // 1. Fetch all users from the user table
      const users: { id: string }[] = await prisma.user.findMany({
         select: { id: true }
      });
      // 2. Extract only their IDs
      const userIds: string[] = users.map((u: { id: string }) => u.id);
      // 3. For each user, create an entry with default USDC balance
      const arr: [string, UserBalance][] = userIds.map((userId: string) => [
         userId,
         {
            USDC: {
               available: 100000,
               locked: 0
            }
         }
      ]);
      return arr;
   }
}
