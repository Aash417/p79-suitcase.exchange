import { Create_order } from '../utils/types';
import { BalanceService } from './balance-service';
import { OrderBookService } from './orderbook-service';
import { RedisPublisher } from './redis-publisher';

export class OrderService {
   constructor(
      private balanceService: BalanceService,
      private orderbooks: OrderBookService[] = []
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
         userId
      );

      // 4. Publish events
      RedisPublisher.getInstance().sendOrderPlaced(clientId, {
         type: 'ORDER_PLACED',
         payload: placedOrder,
      });
      // MarketDataPublisher.sendDepthUpdate(market, fills);
   }

   cancelOrder(data: CancelData, clientId: string) {
      const { orderId, market } = data;
      const orderbook = this.getOrderBook(market);
      const order = orderbook.findOrder(orderId);

      if (order.side === 'buy') {
         orderbook.cancelBid(order);
         this.balanceService.unlockFunds(
            order.userId,
            'buy',
            order.price,
            order.quantity
         );
      } else {
         orderbook.cancelAsk(order);
         this.balanceService.unlockFunds(
            order.userId,
            'sell',
            order.price,
            order.quantity
         );
      }

      RedisPublisher.sendOrderCancelled(clientId, orderId);
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
