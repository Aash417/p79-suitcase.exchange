import { z } from 'zod';

export const CREATE_ORDER = 'CREATE_ORDER';
export const CANCEL_ORDER = 'CANCEL_ORDER';
export const ON_RAMP = 'ON_RAMP';
export const GET_OPEN_ORDERS = 'GET_OPEN_ORDERS';

export const GET_DEPTH = 'GET_DEPTH';

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
                 price: string;
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
           price: string;
           quantity: string;
           side: 'buy' | 'sell';
           userId: string;
        }[];
     };

export type MessageToEngine =
   | {
        type: typeof CREATE_ORDER;
        data: {
           market: string;
           price: string;
           quantity: string;
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

export const postOrderSchema = z.object({
   market: z.string().min(1).max(10),
   price: z.string().min(1),
   quantity: z.string().min(1),
   side: z.enum(['buy', 'sell']),
   userId: z.string().min(1).max(10),
});

export const deleteOrderSchema = z.object({
   orderId: z.string().min(1),
   market: z.string().min(1).max(10),
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
