import { z } from 'zod';

export const CREATE_ORDER = 'CREATE_ORDER';
export const CANCEL_ORDER = 'CANCEL_ORDER';
export const ON_RAMP = 'ON_RAMP';
export const GET_OPEN_ORDERS = 'GET_OPEN_ORDERS';
export const GET_DEPTH = 'GET_DEPTH';
export const GET_CAPITAL = 'GET_CAPITAL';
export const ADD_NEW_USER = 'ADD_NEW_USER';

export const postOrderSchema = z.object({
   market: z.string().min(3, 'Market is required'),
   price: z
      .string()
      .regex(/^[1-9]\d*$/, 'Price must be a positive integer (paise)'),
   quantity: z
      .string()
      .regex(/^[1-9]\d*$/, 'Quantity must be a positive integer'),
   side: z.enum(['buy', 'sell']),
   userId: z.string().min(1, 'User ID is required')
});

export const deleteOrderSchema = z.object({
   orderId: z.string().min(1),
   market: z.string().min(1).max(10)
});

export const onRampSchema = z.object({
   userId: z.string().min(1),
   asset: z.string().min(1),
   quantity: z.string().regex(/^[1-9]\d*$/, 'Amount must be a positive integer')
});
