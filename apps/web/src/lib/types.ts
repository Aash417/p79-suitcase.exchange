export interface Ticker {
   firstPrice: string;
   high: string;
   lastPrice: string;
   low: string;
   priceChange: string;
   priceChangePercent: string;
   quoteVolume: string;
   symbol: string;
   trades: string;
   volume: string;
}

export interface Trades {
   id: number;
   isBuyerMaker: boolean;
   price: string;
   quantity: string;
   quoteQuantity: string;
   timestamp: number;
}

export interface Depth {
   bids: [string, string][];
   asks: [string, string][];
   lastUpdateId: string;
   timestamp: number;
}
