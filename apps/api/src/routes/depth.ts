import { Hono } from 'hono';
import { RedisManager } from '../utils/RedisManager';
import { GET_DEPTH } from '../utils/types';

const depth = new Hono();

depth.get('/', async (c) => {
   const { symbol } = c.req.query();
   if (!symbol) {
      return c.json({ error: 'Missing symbol parameter' }, 400);
   }
   const response = await RedisManager.getInstance().sendAndAwait({
      type: GET_DEPTH,
      data: {
         market: symbol
      }
   });

   return c.json(response.payload);
});

export default depth;
