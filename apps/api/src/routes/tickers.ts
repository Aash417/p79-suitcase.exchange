import fs from 'fs/promises';
import { Hono } from 'hono';
import { TICKERS_FILE } from '../utils/collect-data';

const ticker = new Hono();

ticker.get('/', async (c) => {
   try {
      const data = await fs.readFile(TICKERS_FILE, 'utf-8');
      const tickers = JSON.parse(data);
      return c.json(tickers);
   } catch (err) {
      console.log('Error reading tickers file:', err);
      return c.json({ error: 'Tickers data not available' }, 500);
   }
});

export default ticker;
