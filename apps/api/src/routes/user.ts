import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { RedisManager } from '../utils/RedisManager';
import { ADD_NEW_USER } from '../utils/types';

const user = new Hono();

user.post(
   '/add',
   zValidator(
      'json',
      z.object({
         userId: z.string().min(1, 'User ID is required')
      })
   ),
   async (c) => {
      const { userId } = c.req.valid('json');
      const response = await RedisManager.getInstance().sendAndAwait({
         type: ADD_NEW_USER,
         data: {
            userId
         }
      });

      return c.json(response);
   }
);

export default user;
