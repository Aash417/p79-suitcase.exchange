import fs from 'fs/promises';
import path from 'path';

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

export function startDataCollection() {
   fetchAndSaveTickers();
   fetchAndSaveKlines();
   fetchAndSaveSingleTickers();
   fetchAndSaveTrades();

   setInterval(
      () => {
         fetchAndSaveTickers();
         fetchAndSaveKlines();
         fetchAndSaveSingleTickers();
         fetchAndSaveTrades();
      },
      6 * 60 * 1000
   );
}

async function ensureDataDir() {
   try {
      await fs.mkdir(DATA_DIR, { recursive: true });
   } catch (e) {
      // Directory may already exist
   }
}

export async function fetchAndSaveTickers() {
   await ensureDataDir();
   const res = await fetch('https://api.backpack.exchange/api/v1/tickers');
   const tickers = await res.json();
   await fs.writeFile(TICKERS_FILE, JSON.stringify(tickers, null, 2), 'utf-8');
}

export async function fetchAndSaveKlines() {
   await ensureDataDir();
   const allKlines: Record<string, any> = {};
   for (const symbol of SYMBOLS_ARRAY) {
      try {
         const res = await fetch(
            `https://api.backpack.exchange/api/v1/klines?symbol=${symbol}&interval=1d&startTime=1714865400`
         );
         const klineData = await res.json();
         allKlines[symbol] = klineData;
      } catch (e) {
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
         const res = await fetch(
            `https://api.backpack.exchange/api/v1/ticker?symbol=${symbol}`
         );
         const tickerData = await res.json();
         allTickers[symbol] = tickerData;
      } catch (e) {
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
         const res = await fetch(
            `https://api.backpack.exchange/api/v1/trades?symbol=${symbol}&limit=20`
         );
         const tradesData = await res.json();
         allTrades[symbol] = tradesData;
      } catch (e) {
         allTrades[symbol] = null;
      }
   }
   await fs.writeFile(TRADES_FILE, JSON.stringify(allTrades, null, 2), 'utf-8');
}
