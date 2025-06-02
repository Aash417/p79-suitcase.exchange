// types coming from the engine to the api server
export type EngineToApiMessage =
   | Depth
   | OrderPlaced
   | OrderCancelled
   | OpenOrders;

export type Depth = {
   type: 'DEPTH';
   payload: {
      market: string;
      bids: [string, string][];
      asks: [string, string][];
   };
};
export type OrderPlaced = {
   type: 'ORDER_PLACED';
   payload: {
      orderId: string;
      executedQty: number;
      fills: [
         {
            price: number;
            qty: number;
            tradeId: number;
         }
      ];
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
   payload: {
      orderId: string;
      executedQty: number;
      price: number;
      quantity: number;
      side: OrderSide;
      userId: string;
   }[];
};

// types coming from the api to the engine server
export type ApiToEngineMessage =
   | CreateOrder
   | CancelOrder
   | OnRamp
   | GetDepth
   | GetOpenOrders
   | GetCapital
   | AddNewUser;

export type OperationTypes =
   | 'CREATE_ORDER'
   | 'CANCEL_ORDER'
   | 'ON_RAMP'
   | 'GET_DEPTH'
   | 'GET_OPEN_ORDERS'
   | 'GET_CAPITAL'
   | 'ADD_NEW_USER';

export type OrderSide = 'buy' | 'sell';

export type CreateOrder = {
   type: 'CREATE_ORDER';
   data: {
      market: string;
      price: number;
      quantity: number;
      side: OrderSide;
      userId: string;
   };
};
export type CancelOrder = {
   type: 'CANCEL_ORDER';
   data: {
      orderId: string;
      market: string;
   };
};
export type OnRamp = {
   type: 'ON_RAMP';
   data: {
      quantity: number;
      userId: string;
      asset: string;
   };
};
export type GetDepth = {
   type: 'GET_DEPTH';
   data: {
      market: string;
   };
};
export type GetOpenOrders = {
   type: 'GET_OPEN_ORDERS';
   data: {
      userId: string;
      symbol: string;
   };
};
export type GetCapital = {
   type: 'GET_CAPITAL';
   data: {
      userId: string;
   };
};
export type AddNewUser = {
   type: 'ADD_NEW_USER';
   data: {
      userId: string;
   };
};
