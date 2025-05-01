import { Hono } from 'hono';

const ticker = new Hono();

ticker.get('/', async (c) => {
   const { symbol } = c.req.query();

   try {
      const res = await fetch(
         `https://api.backpack.exchange/api/v1/ticker?symbol=${symbol}`,
      );
      const ticker = await res.json();

      return c.json(ticker);
   } catch (error) {
      console.log(error);
      return c.json({ msg: 'error in ticker endpoint' });
   }
});

export default ticker;
