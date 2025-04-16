import {
   CANCEL_ORDER,
   CREATE_ORDER,
   GET_DEPTH,
   MessageFromApi,
   ON_RAMP,
} from '../utils/types';
import { BalanceService } from './balance-service';
import { MarketDataService } from './market-data-service';
import { OrderService } from './order-service';
import { OrderBookService } from './orderbook-matching-service';
import { RedisPublisher } from './redis-publisher';
import { SnapshotService } from './snapshot-service';

export class Engine {
   private snapshotService: SnapshotService;
   private orderService: OrderService;
   private balanceService: BalanceService;
   private marketDataService: MarketDataService;
   private orderbooks: OrderBookService[] = [];

   constructor() {
      this.snapshotService = new SnapshotService();
      this.balanceService = new BalanceService();
      this.orderService = new OrderService(this.balanceService);
      this.orderbooks = [new OrderBookService('SOL')];
      this.orderService = new OrderService(
         this.balanceService,
         this.orderbooks
      );
      this.marketDataService = new MarketDataService(this.orderbooks);

      this.initializeFromSnapshot();
   }

   process({
      message,
      clientId,
   }: {
      message: MessageFromApi;
      clientId: string;
   }) {
      console.log('started processing message');
      try {
         switch (message.type) {
            case CREATE_ORDER:
               this.orderService.createOrder(message, clientId);
               break;
            case CANCEL_ORDER:
               this.orderService.cancelOrder(message.data, clientId);
               break;
            case GET_DEPTH:
               this.marketDataService.sendDepth(message.data.market, clientId);
               break;
            case ON_RAMP:
               this.balanceService.onRamp(
                  message.data.userId,
                  message.data.amount
               );
               break;
         }
      } catch (error) {
         RedisPublisher.getInstance().sendError(clientId, message.type, error);
      }
   }

   private initializeFromSnapshot() {
      try {
         const loaded = this.snapshotService.load();

         if (loaded) {
            this.orderbooks = loaded.orderbooks;
            this.balanceService.setBalances(loaded.balances);

            console.log(this.balanceService);
         } else {
            this.initializeFresh();
         }
      } catch (error) {
         console.error('Snapshot load failed, starting fresh', error);
         this.initializeFresh();
      }
   }

   private initializeFresh() {
      this.orderbooks = [new OrderBookService('SOL')];
      this.balanceService.setDefaultBalances();
   }
}
