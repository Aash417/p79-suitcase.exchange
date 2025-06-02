import { Hono } from 'hono';
import { RedisManager } from '../utils/RedisManager';
import { GET_CAPITAL } from '../utils/types';

const capital = new Hono();

capital.get('/', async (c) => {
   const { userId } = c.req.query();
   if (!userId) {
      return c.json({ error: 'userId is required' }, 400);
   }
   const response = await RedisManager.getInstance().sendAndAwait({
      type: GET_CAPITAL,
      data: { userId }
   });

   return c.json(response.payload);
});

export default capital;
