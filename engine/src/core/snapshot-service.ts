import { readFileSync, writeFileSync } from 'node:fs';
import { SNAPSHOT_PATH } from '../utils/constants';
import { Order, UserBalance } from '../utils/types';
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
      private balanceService: BalanceService
   ) {}

   save() {
      try {
         const snapshot: Snapshot = {
            orderbooks: this.orderbooks.map((ob) => ({
               baseAsset: ob.baseAsset,
               bids: this.getOrdersFromMap(ob.getBidsMap()), // Convert Map<price, Order[]> => Order[]
               asks: this.getOrdersFromMap(ob.getAsksMap()),
               lastTradeId: ob.lastTradeId,
            })),
            balances: Array.from(this.balanceService.getBalances().entries()),
         };

         writeFileSync('./new.json', JSON.stringify(snapshot, null, 2));
         return true;
      } catch (error) {
         console.error('Snapshot save failed:', error);
         return false;
      }
   }

   load() {
      try {
         const data = readFileSync(SNAPSHOT_PATH, 'utf-8');
         const snapshot = JSON.parse(data) as Snapshot;

         for (const obData of snapshot.orderbooks) {
            const orderbook = this.orderbooks.find(
               (ob) => ob.baseAsset === obData.baseAsset
            );
            if (orderbook) {
               orderbook.initialize(
                  obData.bids,
                  obData.asks,
                  obData.lastTradeId
               );
            }
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
