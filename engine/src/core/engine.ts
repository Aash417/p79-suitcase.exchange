import {
   CANCEL_ORDER,
   CREATE_ORDER,
   GET_CAPITAL,
   GET_DEPTH,
   GET_OPEN_ORDERS,
   MessageFromApi,
   ON_RAMP,
} from '../utils/types';
import { BalanceService } from './balance-service';
import { ErrorService } from './error-service';
import { MarketDataService } from './market-data-service';
import { OrderService } from './order-service';
import { OrderBookService } from './orderbook-service';
import { SnapshotService } from './snapshot-service';

export class Engine {
   private snapshotService: SnapshotService;
   private orderService: OrderService;
   private balanceService: BalanceService;
   private marketDataService: MarketDataService;
   private orderbooks: OrderBookService[] = [];
   private errorService: ErrorService;

   constructor() {
      this.errorService = new ErrorService();
      this.orderbooks = [new OrderBookService('SOL')];
      this.marketDataService = new MarketDataService(this.orderbooks);
      this.balanceService = new BalanceService(this.marketDataService);
      this.orderService = new OrderService(
         this.balanceService,
         this.orderbooks,
         this.marketDataService,
      );
      this.snapshotService = new SnapshotService(
         this.orderbooks,
         this.balanceService,
      );

      if (!this.snapshotService.load()) this.initializeFresh();

      setInterval(() => this.snapshotService.save(), 10000);
   }

   process({
      clientId,
      message,
   }: {
      clientId: string;
      message: MessageFromApi;
   }) {
      console.log('started processing message');
      try {
         switch (message.type) {
            case CREATE_ORDER:
               this.orderService.createOrder(message.data, clientId);
               break;
            case CANCEL_ORDER:
               this.orderService.cancelOrder(message.data, clientId);
               break;
            case ON_RAMP:
               this.balanceService.onRamp(message.data, clientId);
               break;
            case GET_DEPTH:
               this.marketDataService.sendDepth(message.data.market, clientId);
               break;
            case GET_CAPITAL:
               this.balanceService.getUserBalances(
                  message.data.userId,
                  clientId,
               );
               break;
            case GET_OPEN_ORDERS:
               this.orderService.getUserOpenOrders(message.data, clientId);
               break;
         }
      } catch (error) {
         this.errorService.handleError(error, clientId);
      }
   }

   private initializeFresh() {
      this.orderbooks = [new OrderBookService('SOL')];
      this.balanceService.setDefaultBalances();
   }
}
