import type { OrderSide } from '@repo/shared-types/messages/api-engine';

export interface UserBalance {
   [asset: string]: {
      available: number;
      locked: number;
   };
}

export interface Order {
   price: number;
   quantity: number;
   orderId: string;
   filled: number;
   side: OrderSide;
   userId: string;
}

export interface OrderWithMarket extends Order {
   market: string;
}
