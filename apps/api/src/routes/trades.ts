import fs from 'fs/promises';
import { Hono } from 'hono';
import { TRADES_FILE } from '../utils/collect-data';

const trades = new Hono();

trades.get('/', async (c) => {
   const { symbol } = c.req.query();
   if (!symbol) {
      return c.json({ error: 'Missing symbol parameter' }, 400);
   }
   try {
      const data = await fs.readFile(TRADES_FILE, 'utf-8');
      const allTrades = JSON.parse(data);
      if (!(symbol in allTrades)) {
         return c.json({ error: 'Symbol not found' }, 404);
      }
      return c.json(allTrades[symbol]);
   } catch (error) {
      console.log(error);
      return c.json({ msg: 'error in trades endpoint' }, 500);
   }
});

export default trades;
