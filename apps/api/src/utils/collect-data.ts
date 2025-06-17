import fs from 'fs/promises';
import path from 'path';
import { tryCatch } from './tryCatch';

export const DATA_DIR = path.join(__dirname, '../data');
export const TICKERS_FILE = path.join(DATA_DIR, 'tickers.json');
export const KLINE_FILE = path.join(DATA_DIR, 'kline.json');
export const SINGLE_TICKER_FILE = path.join(DATA_DIR, 'single-ticker.json');
export const TRADES_FILE = path.join(DATA_DIR, 'trades.json');

export const SYMBOLS_ARRAY = [
   'BTC_USDC',
   'ETH_USDC',
   'SOL_USDC',
   'LINK_USDC',
   'TRUMP_USDC',
   'AAVE_USDC'
];

export async function startDataCollection() {
   const { data, error } = await tryCatch(
      fetch('https://api.backpack.exchange/api/v1/status')
   );

   if (error || data?.status !== 200) {
      console.error(
         'Backpack API is down or unreachable. Skipping data collection.'
      );
   } else {
      fetchAndSaveTickers();
      fetchAndSaveKlines();
      fetchAndSaveSingleTickers();
      fetchAndSaveTrades();
   }

   console.log('live data collected');

   setInterval(
      async () => {
         const { data, error } = await tryCatch(
            fetch('https://api.backpack.exchange/api/v1/status')
         );

         if (error || data?.status !== 200) {
            console.error(
               'Backpack API is down or unreachable. Skipping data collection.'
            );
         } else {
            fetchAndSaveTickers();
            fetchAndSaveKlines();
            fetchAndSaveSingleTickers();
            fetchAndSaveTrades();
         }
      },
      6 * 60 * 1000
   );
}

async function ensureDataDir() {
   try {
      await fs.mkdir(DATA_DIR, { recursive: true });
   } catch (error) {
      console.error('Error ensuring data directory exists:', error);
      // Directory may already exist, continue execution
   }
}

export async function fetchAndSaveTickers() {
   await ensureDataDir();
   try {
      const response = await fetch(
         'https://api.backpack.exchange/api/v1/tickers'
      );
      const tickers = await response.json();
      await fs.writeFile(
         TICKERS_FILE,
         JSON.stringify(tickers, null, 2),
         'utf-8'
      );
   } catch (error: any) {
      console.error('Failed to fetch or process tickers:', error.message);
   }
}

export async function fetchAndSaveKlines() {
   await ensureDataDir();
   const allKlines: Record<string, any> = {};

   for (const symbol of SYMBOLS_ARRAY) {
      try {
         const response = await fetch(
            `https://api.backpack.exchange/api/v1/klines?symbol=${symbol}&interval=1d&startTime=1714865400`
         );
         const klineData = await response.json();
         allKlines[symbol] = klineData;
      } catch (error: any) {
         console.error(
            `Failed to fetch or process klines for ${symbol}:`,
            error.message
         );
         allKlines[symbol] = null;
      }
   }
   await fs.writeFile(KLINE_FILE, JSON.stringify(allKlines, null, 2), 'utf-8');
}

export async function fetchAndSaveSingleTickers() {
   await ensureDataDir();
   const allTickers: Record<string, any> = {};
   for (const symbol of SYMBOLS_ARRAY) {
      try {
         const response = await fetch(
            `https://api.backpack.exchange/api/v1/ticker?symbol=${symbol}`
         );
         const tickerData = await response.json();
         allTickers[symbol] = tickerData;
      } catch (error: any) {
         console.error(
            `Failed to fetch or process ticker for ${symbol}:`,
            error.message
         );
         allTickers[symbol] = null;
      }
   }
   await fs.writeFile(
      SINGLE_TICKER_FILE,
      JSON.stringify(allTickers, null, 2),
      'utf-8'
   );
}

export async function fetchAndSaveTrades() {
   await ensureDataDir();
   const allTrades: Record<string, any> = {};
   for (const symbol of SYMBOLS_ARRAY) {
      try {
         const response = await fetch(
            `https://api.backpack.exchange/api/v1/trades?symbol=${symbol}&limit=20`
         );
         const tradesData = await response.json();
         allTrades[symbol] = tradesData;
      } catch (e: any) {
         console.error(
            `Failed to fetch or process trades for ${symbol}`,
            e.message
         );
         allTrades[symbol] = null;
      }
   }
   await fs.writeFile(TRADES_FILE, JSON.stringify(allTrades, null, 2), 'utf-8');
}
