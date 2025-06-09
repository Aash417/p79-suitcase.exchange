import { readFileSync, writeFileSync } from 'node:fs';
import { BACKUP_FILE_PATH, SNAPSHOT_PATH } from '../utils/constants';
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

         writeFileSync(BACKUP_FILE_PATH, JSON.stringify(snapshot, null, 2));
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

         this.balanceService.setBalances(new Map(snapshot.balances));

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
}
