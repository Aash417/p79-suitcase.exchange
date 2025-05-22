import { KLine } from '@/features/klineChart/utils/types';
import { Depth } from '@/features/orderbook/utils/types';
import { SYMBOLS_MAP } from './constants';
import { API_URL } from './env';
import { Ticker, Trades } from './types';

export async function getKlines(market: string): Promise<KLine[]> {
   const kline = await fetch(
      `${API_URL}/klines?symbol=${market}&interval=1d&startTime=1714865400`
   );
   const klineData: KLine[] = await kline.json();

   return klineData.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}

export async function getDepth(market: string): Promise<Depth> {
   const depth = await fetch(`${API_URL}/depth?symbol=${market}`);
   const depthData = await depth.json();

   const final = {
      ...depthData,
      bids: [...depthData.bids].reverse(), // Highest first
      asks: [...depthData.asks] // Lowest first (already sorted)
   };
   return final;
}

export async function getTickers() {
   const res = await fetch(`${API_URL}/tickers`);
   const data: Ticker[] = await res.json();

   // Now lookup is O(1) instead of O(m)
   const tickerData = data.reduce((acc: any[], ticker: Ticker) => {
      const symbolInfo = SYMBOLS_MAP.get(ticker.symbol);
      if (symbolInfo) {
         acc.push({
            symbol: ticker.symbol,
            price: ticker.lastPrice,
            volume: ticker.quoteVolume,
            change: (Number(ticker.priceChangePercent) * 100).toFixed(2),
            name: symbolInfo.name,
            imageUrl: symbolInfo.imageUrl
         });
      }
      return acc;
   }, []);

   return tickerData;
}

export async function getTicker(market: string) {
   const res = await fetch(`${API_URL}/ticker?symbol=${market}`);
   const data: Ticker = await res.json();

   const symbolInfo = SYMBOLS_MAP.get(data.symbol);
   if (symbolInfo) {
      return {
         ...data,
         change: (Number(data.priceChangePercent) * 100).toFixed(2),
         name: symbolInfo.name,
         imageUrl: symbolInfo.imageUrl
      };
   }
}

export async function getTrades(market: string) {
   const res = await fetch(`${API_URL}/trades?symbol=${market}&limit=20`);
   const data: Trades[] = await res.json();

   return data;
}
