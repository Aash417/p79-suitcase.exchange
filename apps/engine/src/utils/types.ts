import type { OrderSide } from '@suitcase/shared-types/messages/api-engine';

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
