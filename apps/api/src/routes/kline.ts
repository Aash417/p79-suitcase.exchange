import { Hono } from 'hono';
import { KLine } from '../utils/types';

const kline = new Hono();

kline.get('/', async (c) => {
   const { symbol } = c.req.query();

   try {
      const kline = await fetch(
         `https://api.backpack.exchange/api/v1/klines?symbol=${symbol}&interval=1d&startTime=1714865400`
      );
      const klineData: KLine[] = await kline.json();

      return c.json(klineData);
   } catch (err) {
      console.log(err);
      c.json({ error: 'Database query failed' }, 500);
   }
});

export default kline;
