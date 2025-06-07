import fs from 'fs/promises';
import { Hono } from 'hono';
import { SINGLE_TICKER_FILE } from '../utils/collect-data';

const ticker = new Hono();

ticker.get('/', async (c) => {
   const { symbol } = c.req.query();
   if (!symbol) {
      return c.json({ error: 'Missing symbol parameter' }, 400);
   }
   try {
      const data = await fs.readFile(SINGLE_TICKER_FILE, 'utf-8');
      const allTickers = JSON.parse(data);
      if (!(symbol in allTickers)) {
         return c.json({ error: 'Dont have data for this symbol' }, 404);
      }
      return c.json(allTickers[symbol]);
   } catch (error) {
      console.log(error);
      return c.json({ msg: 'error in ticker endpoint' }, 500);
   }
});

export default ticker;
