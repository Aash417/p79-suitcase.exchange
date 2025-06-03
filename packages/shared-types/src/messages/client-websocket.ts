// types coming from the websocket to the client
export type WebSocketToClientMessage =
   | TickerUpdateMessage
   | DepthUpdateMessage
   | TradeUpdateMessage;

export type TickerUpdateMessage = {
   stream: string;
   data: {
      e: 'ticker'; // Event type
      E?: number; // Event time in microseconds
      s: string; // Symbol (e.g., "SOL_USD")
      o: string; // First price
      c: string; // Last price
      h: string; // High price
      l: string; // Low price
      v: string; // Base asset volume
      V: string; // Quote asset volume
      n?: number; // Number of trades
   };
};

export type DepthUpdateMessage = {
   stream: string;
   data: {
      e: 'depth'; // Event type
      E?: number; // Event time in microseconds
      s?: string; // Symbol (e.g., "SOL_USDC")
      a: [string, string][]; // Asks: [price, quantity]
      b: [string, string][]; // Bids: [price, quantity]
      U?: number; // First update ID in event
      u?: number; // Last update ID in event
      T?: number; // Engine timestamp in microseconds
   };
};

export type TradeUpdateMessage = {
   stream: string;
   data: {
      e: 'trade'; // Event type
      E?: number; // Event time in microseconds
      s?: string; // Symbol (e.g., "SOL_USDC")
      p: string; // Price
      q: string; // Quantity
      b?: string; // Buyer order ID
      a?: string; // Seller order ID
      t?: number; // Trade ID
      T: number; // Engine timestamp in microseconds
      m: boolean; // Is the buyer the maker?
   };
};

// types coming from the client to the websocket server
export type ClientToWebSocketMessage = SubscribeMessage | UnsubscribeMessage;

type SubscribeMessage = {
   method: 'SUBSCRIBE';
   params: string[];
};

type UnsubscribeMessage = {
   method: 'UNSUBSCRIBE';
   params: string[];
};
