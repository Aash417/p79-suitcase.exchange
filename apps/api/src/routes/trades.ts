import { Hono } from 'hono';

const trades = new Hono();

trades.get('/', async (c) => {
   const { symbol } = c.req.query();
   const res = await fetch(
      `https://api.backpack.exchange/api/v1/trades?symbol=${symbol}&limit=20`
   );
   const trades = (await res.json()) as any;

   return c.json(trades);
});

export default trades;
