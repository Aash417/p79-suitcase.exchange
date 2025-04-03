import { Hono } from 'hono';
import { KLine } from '../utils/types';

const kline = new Hono();

kline.get('/', async (c) => {
   console.log('kline');
   const { market } = c.req.query();
   console.log(market);

   try {
      const kline = await fetch(
         `https://api.backpack.exchange/api/v1/klines?symbol=${market}&interval=1d&startTime=1714865400`,
      );
      const klineData: KLine[] = await kline.json();

      // klineData.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));

      return c.json(klineData);
      // return c.json({msg:'ok'})
   } catch (err) {
      console.log(err);
      c.json({ error: 'Database query failed' }, 500);
   }
});

export default kline;
