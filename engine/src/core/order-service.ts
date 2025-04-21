import { QUOTE_ASSET } from '../utils/constants';
import {
   Cancel_order,
   Create_order,
   GET_OPEN_ORDERS,
   Order,
} from '../utils/types';
import { BalanceService } from './balance-service';
import { MarketDataService } from './market-data-service';
import { OrderBookService } from './orderbook-service';
import { RedisPublisher } from './redis-publisher';

export class OrderService {
   constructor(
      private balanceService: BalanceService,
      private orderbooks: OrderBookService[] = [],
      private marketDataService: MarketDataService,
   ) {}

   createOrder(order: Create_order['data'], clientId: string) {
      const { market, price, quantity, side, userId } = order;
      const orderbook = this.getOrderBook(market);

      // 1. Lock funds (in paisa)
      this.balanceService.lockFunds(userId, side, price, quantity);

      // 2. Add to orderbook (integer math)
      const placedOrder = orderbook.addOrder({
         userId,
         orderId: this.generateId(),
         side,
         price, // Already in paisa
         quantity,
         filled: 0,
      });

      // 3. Update balances
      this.balanceService.updateBalanceAfterTrade(
         placedOrder.fills,
         market,
         side,
         userId,
      );

      this.marketDataService.publishDepthUpdate(
         placedOrder.fills,
         side,
         market,
         price,
      );

      // 4. Publish events
      RedisPublisher.getInstance().sendOrderPlaced(clientId, {
         type: 'ORDER_PLACED',
         payload: placedOrder,
      });
   }

   cancelOrder(data: Cancel_order['data'], clientId: string) {
      const { orderId, market } = data;

      // 1. Find orderbook and order
      const orderbook = this.getOrderBook(market);
      const order = orderbook.findOrder(orderId);
      if (!order) throw new Error(`Order ${orderId} not found`);

      // 2. Cancel in orderbook
      const cancelled = orderbook.cancelOrder(orderId, order.side);
      if (!cancelled) throw new Error(`Failed to cancel order ${orderId}`);

      // 3. Unlock funds
      this.unlockFunds(order.order);

      // 4. Notify client
      RedisPublisher.getInstance().sendOrderCancelled(clientId, orderId);

      // 5. Update market data
      // this.marketDataService.publishOrderCancelled(market, order.price);
   }

   getUserOpenOrders(data: GET_OPEN_ORDERS['data'], clientId: string) {
      const { userId, market } = data;
      const relevantBooks = market
         ? [this.getOrderBook(market)]
         : this.orderbooks;

      const orders = relevantBooks.flatMap((ob) => ob.getOpenOrders(userId));

      RedisPublisher.getInstance().sendOpenOrders(clientId, orders);
   }

   private unlockFunds(order: Order) {
      const asset = order.side === 'buy' ? QUOTE_ASSET : 'SOL';
      const amount = order.price * order.quantity;

      this.balanceService.unlockFunds(order.userId, asset, amount);
   }

   private getOrderBook(market: string) {
      const orderbook = this.orderbooks.find((o) => o.ticker() === market);
      if (!orderbook) throw new Error('Orderbook not found');
      return orderbook;
   }

   private generateId() {
      return Math.random().toString(36).substring(2, 15);
   }
}
