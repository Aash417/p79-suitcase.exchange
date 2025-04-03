import { Hono } from 'hono';

const ticker = new Hono();

ticker.get('/', async (c) => {
   return c.json({ message: 'Hello from ticker' });
});

export default ticker;
