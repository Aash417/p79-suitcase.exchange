import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { RedisManager } from '../utils/RedisManager';
import {
   CANCEL_ORDER,
   CREATE_ORDER,
   deleteOrderSchema,
   GET_OPEN_ORDERS,
   postOrderSchema,
} from '../utils/types';

const order = new Hono();

order.post('/', zValidator('json', postOrderSchema), async (c) => {
   const { market, price, quantity, side, userId } = c.req.valid('json');
   console.log({ market, price, quantity, side, userId });

   //TODO: can u make the type of the response object right? Right now it is a union.
   const response = await RedisManager.getInstance().sendAndAwait({
      type: CREATE_ORDER,
      data: {
         market,
         price,
         quantity,
         side,
         userId,
      },
   });
   return c.json(response.payload);
});

order.delete('/', zValidator('json', deleteOrderSchema), async (c) => {
   const { orderId, market } = c.req.valid('json');
   const response = await RedisManager.getInstance().sendAndAwait({
      type: CANCEL_ORDER,
      data: {
         orderId,
         market,
      },
   });
   return c.json(response.payload);
});

order.get('/open', async (c) => {
   const { userId, market } = c.req.query();

   const response = await RedisManager.getInstance().sendAndAwait({
      type: GET_OPEN_ORDERS,
      data: {
         userId,
         market,
      },
   });
   return c.json(response.payload);
});

export default order;
