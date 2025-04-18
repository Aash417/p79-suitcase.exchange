import { QUOTE_ASSET } from '../utils/constants';
import { Cancel_order, Create_order, Order } from '../utils/types';
import { BalanceService } from './balance-service';
import { OrderBookService } from './orderbook-service';
import { RedisPublisher } from './redis-publisher';

export class OrderService {
   constructor(
      private balanceService: BalanceService,
      private orderbooks: OrderBookService[] = [],
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

      // 4. Publish events
      RedisPublisher.getInstance().sendOrderPlaced(clientId, {
         type: 'ORDER_PLACED',
         payload: placedOrder,
      });

      // MarketDataPublisher.sendDepthUpdate(market, fills);
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

   private async unlockFunds(order: Order): Promise<void> {
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
