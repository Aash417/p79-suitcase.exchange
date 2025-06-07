import fs from 'fs/promises';
import { Hono } from 'hono';
import { KLINE_FILE } from '../utils/collect-data';

const kline = new Hono();

kline.get('/', async (c) => {
   const { symbol } = c.req.query();
   if (!symbol) {
      return c.json({ error: 'Missing symbol parameter' }, 400);
   }
   try {
      const data = await fs.readFile(KLINE_FILE, 'utf-8');
      const allKlines = JSON.parse(data);
      if (!(symbol in allKlines)) {
         return c.json({ error: 'Dont have data for this symbol' }, 404);
      }

      return c.json(allKlines[symbol]);
   } catch (err) {
      console.log(err);
      return c.json({ error: 'Kline data not available' }, 500);
   }
});

export default kline;
