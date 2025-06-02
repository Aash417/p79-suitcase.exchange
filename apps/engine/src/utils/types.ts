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

export interface Fill {
   price: number;
   quantity: number;
   tradeId: number;
   otherUserId: string;
   markerOrderId: string;
}

export type TickerUpdateMessage = {
   stream: string;
   data: {
      c?: string;
      h?: string;
      l?: string;
      v?: string;
      V?: string;
      s?: string;
      id: number;
      e: 'ticker';
   };
};

export type DepthUpdateMessage = {
   stream: string;
   data: {
      b?: [string, string][];
      a?: [string, string][];
      e: 'depth';
      t: number;
   };
};

export type TradeAddedMessage = {
   stream: string;
   data: {
      e: 'trade';
      t: number;
      m: boolean;
      p: number;
      q: string;
      s: string; // symbol
   };
};

export type WsMessage =
   | TickerUpdateMessage
   | DepthUpdateMessage
   | TradeAddedMessage;

export type DbMessage =
   | {
        type: 'TRADE_ADDED';
        data: {
           id: string;
           isBuyerMaker: boolean;
           price: number;
           quantity: number;
           quoteQuantity: number;
           timestamp: number;
           market: string;
        };
     }
   | {
        type: 'ORDER_UPDATE';
        data: {
           orderId: string;
           executedQty: number;
           market?: string;
           price?: number;
           quantity?: number;
           side?: OrderSide;
        };
     };
