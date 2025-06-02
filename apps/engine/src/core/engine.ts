import type { ApiToEngineMessage } from '@suitcase/shared-types/messages/api-engine';
import { BalanceService } from './balance-service';
import { ErrorService } from './error-service';
import { MarketDataService } from './market-data-service';
import { OrderService } from './order-service';
import { OrderBookService } from './orderbook-service';
import { SnapshotService } from './snapshot-service';

export class Engine {
   private readonly snapshotService: SnapshotService;
   private readonly orderService: OrderService;
   private readonly balanceService: BalanceService;
   private readonly marketDataService: MarketDataService;
   private orderbooks: OrderBookService[] = [];
   private readonly errorService: ErrorService;

   constructor() {
      this.errorService = new ErrorService();

      // Initialize services with empty orderbooks array
      this.marketDataService = new MarketDataService(this.orderbooks);
      this.balanceService = new BalanceService(this.marketDataService);
      this.orderService = new OrderService(
         this.balanceService,
         this.orderbooks,
         this.marketDataService
      );

      // Create snapshot service with callback to update orderbooks
      this.snapshotService = new SnapshotService(
         this.orderbooks,
         this.balanceService,
         (orderbooks) => {
            // Update orderbooks array
            this.orderbooks = orderbooks;
            // Update references in other services
            this.marketDataService.updateOrderbooks(orderbooks);
            this.orderService.updateOrderbooks(orderbooks);
         }
      );

      if (!this.snapshotService.load()) this.initializeFresh();

      setInterval(() => this.snapshotService.save(), 15000);
   }

   process({
      clientId,
      message
   }: {
      clientId: string;
      message: ApiToEngineMessage;
   }) {
      try {
         switch (message.type) {
            case 'CREATE_ORDER':
               this.orderService.createOrder(message.data, clientId);
               break;
            case 'CANCEL_ORDER':
               this.orderService.cancelOrder(message.data, clientId);
               break;
            case 'ON_RAMP':
               this.balanceService.onRamp(message.data, clientId);
               break;
            case 'GET_DEPTH':
               this.marketDataService.sendDepth(message.data.market, clientId);
               break;
            case 'GET_CAPITAL':
               this.balanceService.getUserBalances(
                  message.data.userId,
                  clientId
               );
               break;
            case 'GET_OPEN_ORDERS':
               this.orderService.getUserOpenOrders(message.data, clientId);
               break;
            case 'ADD_NEW_USER':
               this.balanceService.addNewUser(message.data.userId, clientId);
               break;
         }
      } catch (error) {
         this.errorService.handleError(error as Error, clientId);
      }
   }

   private initializeFresh() {
      this.orderbooks = [new OrderBookService('SOL', [], [])];
      this.balanceService.setDefaultBalances();
   }
}
