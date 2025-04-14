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
   price: number;
   qty: number;
   tradeId: number;
   otherUserId: string;
   markerOrderId: string;
}

export const BASE_CURRENCY = 'USDC';

export const CREATE_ORDER = 'CREATE_ORDER';
export const CANCEL_ORDER = 'CANCEL_ORDER';
export const ON_RAMP = 'ON_RAMP';
export const GET_OPEN_ORDERS = 'GET_OPEN_ORDERS';
export const GET_DEPTH = 'GET_DEPTH';
export const TRADE_ADDED = 'TRADE_ADDED';
export const ORDER_UPDATE = 'ORDER_UPDATE';

export type MessageToApi =
   | {
        type: 'DEPTH';
        payload: {
           bids: [string, string][];
           asks: [string, string][];
        };
     }
   | {
        type: 'ORDER_PLACED';
        payload: {
           orderId: string;
           executedQty: number;
           fills: {
              price: number;
              qty: number;
              tradeId: number;
           }[];
        };
     }
   | {
        type: 'ORDER_CANCELLED';
        payload: {
           orderId: string;
           executedQty: number;
           remainingQty: number;
        };
     }
   | {
        type: 'OPEN_ORDERS';
        payload: Order[];
     };

export type MessageFromApi =
   | {
        type: typeof CREATE_ORDER;
        data: {
           market: string;
           price: number;
           quantity: number;
           side: 'buy' | 'sell';
           userId: string;
        };
     }
   | {
        type: typeof CANCEL_ORDER;
        data: {
           orderId: string;
           market: string;
        };
     }
   | {
        type: typeof ON_RAMP;
        data: {
           amount: string;
           userId: string;
           txnId: string;
        };
     }
   | {
        type: typeof GET_DEPTH;
        data: {
           market: string;
        };
     }
   | {
        type: typeof GET_OPEN_ORDERS;
        data: {
           userId: string;
           market: string;
        };
     };

//TODO: Can we share the types between the ws layer and the engine?

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
   };
};

export type TradeAddedMessage = {
   stream: string;
   data: {
      e: 'trade';
      t: number;
      m: boolean;
      p: string;
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
        type: typeof TRADE_ADDED;
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
        type: typeof ORDER_UPDATE;
        data: {
           orderId: string;
           executedQty: number;
           market?: string;
           price?: number;
           quantity?: number;
           side?: 'buy' | 'sell';
        };
     };
