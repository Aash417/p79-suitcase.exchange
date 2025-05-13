import { Hono } from 'hono';

const trades = new Hono();

trades.get('/', async (c) => {
   const res = await fetch('https://api.backpack.exchange/api/v1/tickers?limit=20');
   const trades = await res.json();

   return c.json(trades);
});

export default trades;
