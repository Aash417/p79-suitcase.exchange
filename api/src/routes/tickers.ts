import { Hono } from 'hono';

const ticker = new Hono();

ticker.get('/', async (c) => {
   const res = await fetch('https://api.backpack.exchange/api/v1/tickers');
   const tickers = await res.json();

   return c.json(tickers);
});

export default ticker;
