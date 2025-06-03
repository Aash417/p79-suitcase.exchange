// types coming from the engine to the api server
export type EngineToApiMessage =
   | Depth
   | OrderPlaced
   | OrderCancelled
   | OpenOrders
   | OnRampSuccess
   | UserBalance
   | AddNewUserSuccess
   | UserAlreadyExits;

export type Fill = {
   price: number;
   quantity: number;
   tradeId: number;
   otherUserId: string;
   markerOrderId: string;
};
export type Depth = {
   type: 'DEPTH';
   payload: {
      timestamp: number;
      bids: [string, string][];
      asks: [string, string][];
   };
};
export type OrderPlaced = {
   type: 'ORDER_PLACED';
   payload: {
      orderId: number;
      executedQty: number;
      fills: Fill[];
   };
};
export type OrderCancelled = {
   type: 'ORDER_CANCELLED';
   payload: {
      orderId: string;
   };
};
export type OpenOrders = {
   type: 'OPEN_ORDERS';
   payload: {
      id: string;
      price: string;
      quantity: string;
      side: OrderSide;
   }[];
};
export type OnRampSuccess = {
   type: 'ON_RAMP_SUCCESS';
   payload: {
      amount: number;
      asset: string;
      timestamp: number;
   };
};
export type UserBalance = {
   type: 'USER_BALANCE';
   payload: {
      [asset: string]: {
         available: number;
         locked: number;
      };
   };
};
export type AddNewUserSuccess = {
   type: 'ADD_NEW_USER_SUCCESS';
   payload: {
      userId: string;
   };
};
export type UserAlreadyExits = {
   type: 'USER_ALREADY_EXISTS';
   payload: {
      userId: string;
   };
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
