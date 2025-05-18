import { randomUUID } from 'crypto';
import { QUOTE_ASSET } from '../utils/constants';
import {
   Cancel_order,
   Create_order,
   GET_OPEN_ORDERS,
   Order
} from '../utils/types';
import { BalanceService } from './balance-service';
import { MarketDataService } from './market-data-service';
import { OrderBookService } from './orderbook-service';

export class OrderService {
   constructor(
      private balanceService: BalanceService,
      private orderbooks: OrderBookService[] = [],
      private marketDataService: MarketDataService
   ) {}

   updateOrderbooks(orderbooks: OrderBookService[]) {
      this.orderbooks = orderbooks;
   }

   createOrder(order: Create_order['data'], clientId: string) {
      const { market, price, quantity, side, userId } = order;
      const orderbook = this.getOrderBook(market);

      this.balanceService.lockFunds(market, userId, side, price, quantity);

      const { fills, orderId, executedQty, updatedDepth } = orderbook.addOrder({
         userId,
         orderId: randomUUID(),
         side,
         price,
         quantity,
         filled: 0
      });
      this.balanceService.updateBalanceAfterTrade(fills, market, side, userId);

      this.marketDataService.sendOrderPlaced(clientId, {
         type: 'ORDER_PLACED',
         payload: { fills, orderId, executedQty }
      });
      this.marketDataService.publishDepthUpdate(market, updatedDepth);
      this.marketDataService.publishTrades(market, side, fills);
   }

   cancelOrder(data: Cancel_order['data'], clientId: string) {
      const { orderId, market } = data;

      const orderbook = this.getOrderBook(market);
      const order = orderbook.findOrder(orderId);
      if (!order) throw new Error('ORDER_NOT_FOUND');

      const cancelled = orderbook.cancelOrder(orderId, order.side);
      if (!cancelled) throw new Error('ORDER_CANCEL_FAILED');

      this.unlockFunds(order.order);

      this.marketDataService.sendOrderCancelled(clientId, orderId);
      // this.marketDataService.publishDepthUpdate(market);
   }

   getUserOpenOrders(data: GET_OPEN_ORDERS['data'], clientId: string) {
      const { userId, symbol } = data;
      const relevantBooks = symbol
         ? [this.getOrderBook(symbol)]
         : this.orderbooks;

      const orders = relevantBooks.flatMap((ob) => ob.getOpenOrders(userId));

      this.marketDataService.sendOpenOrders(clientId, orders);
   }

   private unlockFunds(order: Order) {
      const asset = order.side === 'buy' ? QUOTE_ASSET : 'SOL';
      const amount = order.price * order.quantity;

      this.balanceService.unlockFunds(order.userId, asset, amount);
   }

   private getOrderBook(market: string) {
      const orderbook = this.orderbooks.find((o) => o.ticker() === market);
      if (!orderbook) throw new Error('ORDERBOOK_NOT_FOUND');
      return orderbook;
   }
}
