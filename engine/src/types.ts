export interface UserBalance {
   [key: string]: {
      available: number;
      locked: number;
   };
}

export interface Order {
   price: number;
   quantity: number;
   orderId: string;
   filled: number;
   side: 'buy' | 'sell';
   userId: string;
}

export interface Fill {
   price: string;
   qty: number;
   tradeId: number;
   otherUserId: string;
   markerOrderId: string;
}
