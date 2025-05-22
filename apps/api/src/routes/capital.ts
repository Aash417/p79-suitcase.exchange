import { Hono } from 'hono';
import { RedisManager } from '../utils/RedisManager';
import { GET_CAPITAL } from '../utils/types';

const capital = new Hono();

capital.get('/', async (c) => {
   const response = await RedisManager.getInstance().sendAndAwait({
      type: GET_CAPITAL,
      data: {
         userId: '47854'
      }
   });

   return c.json(response);
});

export default capital;
