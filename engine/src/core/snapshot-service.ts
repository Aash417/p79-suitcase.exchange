import { readFileSync, writeFileSync } from 'fs';
import { Order, UserBalance } from '../utils/types';
import { BalanceService } from './balance-service';
import { OrderBookService } from './orderbook-matching-service';

type Snapshot = {
   orderbooks: OrderBookSnapshot[];
   balances: [string, UserBalance][]; // Map-like serialization
};

type OrderBookSnapshot = {
   baseAsset: string;
   bids: Order[];
   asks: Order[];
   lastTradeId: number;
};

export class SnapshotService {
   private SNAPSHOT_PATH = './snapshot.json';

   private orderbooks: OrderBookService[];
   private balanceService: BalanceService;

   // Load state from disk
   load() {
      try {
         const data = readFileSync(this.SNAPSHOT_PATH, 'utf-8');
         const parsed = JSON.parse(data) as Snapshot;

         return {
            orderbooks: parsed.orderbooks.map(
               (ob) =>
                  new OrderBookService(ob.baseAsset, ob.bids, ob.asks, ob.lastTradeId)
            ),
            balances: new Map(parsed.balances),
         };
      } catch (error) {
         console.error('Failed to load snapshot', error);
         return false;
      }
   }

   // Save current state to disk
   save() {
      const snapshot: Snapshot = {
         orderbooks: this.orderbooks.map((ob) => ({
            baseAsset: ob.baseAsset,
            bids: ob.getBids(),
            asks: ob.getAsks(),
            lastTradeId: ob.lastTradeId,
         })),
         balances: Array.from(this.balanceService.getBalances()),
      };

      writeFileSync(this.snapshotPath, JSON.stringify(snapshot), 'utf8');
   }
}
