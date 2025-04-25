export type TickerData = {
   e: string; // Event type
   E: number; // Event time in microseconds
   s: string; // Symbol
   o: string; // First price
   c: string; // Last price
   h: string; // High price
   l: string; // Low price
   v: string; // Base asset volume
   V: string; // Quote asset volume
   n: number; // Number of trades
};

export type TradeData = {
   e: string; // Event type
   E: number; // Event time in microseconds
   s: string; // Symbol
   p: string; // Price
   q: string; // Quantity
   b: string; // Buyer order ID
   a: string; // Seller order ID
   t: number; // Trade ID
   T: number; // Engine timestamp in microseconds
   m: boolean; // Is the buyer the maker?
};

export type KlineData = {
   e: string; // Event type
   E: number; // Event time in microseconds
   s: string; // Symbol
   t: number; // K-Line start time in seconds
   T: number; // K-Line close time in seconds
   o: string; // Open price
   c: string; // Close price
   h: string; // High price
   l: string; // Low price
   v: string; // Base asset volume
   n: number; // Number of trades
   X: boolean; // Is this k-line closed?
};

export type DepthData = {
   e: string; // Event type
   E: number; // Event time in microseconds
   s: string; // Symbol
   a: [string, string][]; // Asks
   b: [string, string][]; // Bids
   U: number; // First update ID in event
   u: number; // Last update ID in event
   T: number; // Engine timestamp in microseconds
};

export type WsResponse = {
   stream: string; // Stream name
   data: TickerData | TradeData | KlineData | DepthData; // Data payload
};
