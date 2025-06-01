import type z from 'zod';
import type { onRampSchema, postOrderSchema } from '../schemas/client-api';

// types coming from the client to the api server
export type ClientToApiMessage = ExecuteOrder | OnRamp;

export type ExecuteOrder = z.infer<typeof postOrderSchema>;
export type OnRamp = z.infer<typeof onRampSchema>;

// types coming from the api to the client
export type ApiToClientMessage =
   | Trades
   | Depth
   | Candlesticks
   | Tickers
   | Balances
   | OpenOrders
   | OpenOrder
   | Ticker
   | Trade;

export type Trade = {
   id: number;
   price: string;
   quantity: string;
   quoteQuantity: string;
   timestamp: number;
   isBuyerMaker: boolean;
};

export type Trades = Trade[];
export type Depth = {
   asks: [string, string][]; // [price, quantity]
   bids: [string, string][]; // [price, quantity]
   lastUpdateId: string; // Update ID (as string)
   timestamp: number; // Timestamp in ms
};
export type kline = {
   start: string;
   end: string;
   open: string;
   high: string;
   low: string;
   close: string;
   volume: string;
   quoteVolume: string;
   trades: string;
};
export type Candlesticks = kline[];
export type Ticker = {
   symbol: string;
   firstPrice: string;
   lastPrice: string;
   priceChange: string;
   priceChangePercent: string;
   high: string;
   low: string;
   volume: string;
   quoteVolume: string;
   trades: string;
};
export type Tickers = Ticker[];
export type Balance = {
   available: string;
   locked: string;
};
export type Balances = {
   [key: string]: Balance; // e.g., property1, property2, etc.
};
export type OpenOrder = {
   id: string;
   price: string;
   quantity: string;
   side: string;
};
export type OpenOrders = OpenOrder[];
