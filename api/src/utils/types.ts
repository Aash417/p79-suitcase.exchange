import { z } from 'zod';

export const CREATE_ORDER = 'CREATE_ORDER';
export const CANCEL_ORDER = 'CANCEL_ORDER';
export const ON_RAMP = 'ON_RAMP';
export const GET_OPEN_ORDERS = 'GET_OPEN_ORDERS';
export const GET_DEPTH = 'GET_DEPTH';
export const GET_CAPITAL = 'GET_CAPITAL';

export type MessageFromOrderbook =
   | {
        type: 'DEPTH';
        payload: {
           market: string;
           bids: [string, string][];
           asks: [string, string][];
        };
     }
   | {
        type: 'ORDER_PLACED';
        payload: {
           orderId: string;
           executedQty: number;
           fills: [
              {
                 price: number;
                 qty: number;
                 tradeId: number;
              },
           ];
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
        payload: {
           orderId: string;
           executedQty: number;
           price: number;
           quantity: number;
           side: 'buy' | 'sell';
           userId: string;
        }[];
     };

export type MessageToEngine =
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
           quantity: number;
           userId: string;
           asset: string;
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
           symbol: string;
        };
     }
   | {
        type: typeof GET_CAPITAL;
        data: {
           userId: string;
        };
     };

export const postOrderSchema = z.object({
   market: z.string().min(3, 'Market is required'),
   price: z
      .string()
      .regex(/^[1-9]\d*$/, 'Price must be a positive integer (paise)'),
   quantity: z
      .string()
      .regex(/^[1-9]\d*$/, 'Quantity must be a positive integer'),
   side: z.enum(['buy', 'sell']),
   userId: z.string().min(1, 'User ID is required'),
});

export const deleteOrderSchema = z.object({
   orderId: z.string().min(1),
   market: z.string().min(1).max(10),
});

export const onRampSchema = z.object({
   userId: z.string().min(1),
   asset: z.string().min(1),
   quantity: z
      .string()
      .regex(/^[1-9]\d*$/, 'Amount must be a positive integer'),
});

export interface KLine {
   close: string;
   end: string;
   high: string;
   low: string;
   open: string;
   quoteVolume: string;
   start: string;
   trades: string;
   volume: string;
}
