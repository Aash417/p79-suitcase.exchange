export const CREATE_ORDER = 'CREATE_ORDER';
export const CANCEL_ORDER = 'CANCEL_ORDER';
export const ON_RAMP = 'ON_RAMP';
export const GET_OPEN_ORDERS = 'GET_OPEN_ORDERS';
export const GET_DEPTH = 'GET_DEPTH';
export const GET_CAPITAL = 'GET_CAPITAL';
export const ADD_NEW_USER = 'ADD_NEW_USER';
export const TRADE_ADDED = 'TRADE_ADDED';
export const ORDER_UPDATE = 'ORDER_UPDATE';
export type ORDER_SIDE = 'buy' | 'sell';

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
   side: ORDER_SIDE;
   userId: string;
}

export interface Fill {
   price: number;
   quantity: number;
   tradeId: number;
   otherUserId: string;
   markerOrderId: string;
}

export type Depth = {
   type: 'DEPTH';
   payload: {
      bids: [string, string][];
      asks: [string, string][];
      timestamp: number;
   };
};
export type OrderPlaced = {
   type: 'ORDER_PLACED';
   payload: {
      orderId: number;
      executedQty: number;
      fills: {
         price: number;
         quantity: number;
         tradeId: number;
      }[];
   };
};
export type OrderCancelled = {
   type: 'ORDER_CANCELLED';
   payload: {
      orderId: string;
      executedQty: number;
      remainingQty: number;
   };
};
export type OpenOrders = {
   type: 'OPEN_ORDERS';
   payload: Order[];
};
export type MessageToApi = Depth | OrderPlaced | OrderCancelled | OpenOrders;

export type Create_order = {
   type: typeof CREATE_ORDER;
   data: {
      market: string;
      price: number;
      quantity: number;
      side: ORDER_SIDE;
      userId: string;
   };
};
export type Cancel_order = {
   type: typeof CANCEL_ORDER;
   data: {
      orderId: string;
      market: string;
   };
};
export type On_Ramp = {
   type: typeof ON_RAMP;
   data: {
      userId: string;
      asset: string;
      quantity: number;
   };
};
export type GET_DEPTH = {
   type: typeof GET_DEPTH;
   data: {
      market: string;
   };
};
export type GET_OPEN_ORDERS = {
   type: typeof GET_OPEN_ORDERS;
   data: {
      userId: string;
      symbol: string;
   };
};
export type GET_CAPITAL = {
   type: typeof GET_CAPITAL;
   data: {
      userId: string;
   };
};

export type ADD_NEW_USER = {
   type: typeof ADD_NEW_USER;
   data: {
      userId: string;
   };
};
export type MessageFromApi =
   | Create_order
   | Cancel_order
   | On_Ramp
   | GET_DEPTH
   | GET_OPEN_ORDERS
   | GET_CAPITAL
   | ADD_NEW_USER;

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
           side?: ORDER_SIDE;
        };
     };
