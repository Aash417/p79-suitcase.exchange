import { KLine } from '@/features/klineChart/utils/types';
import { Depth } from '@/features/orderbook/utils/types';
import { SYMBOLS_MAP } from './constants';
import { API_URL_BACKPACK } from './env';
import { Ticker } from './types';

export async function getKlines(market: string): Promise<KLine[]> {
   const kline = await fetch(
      `${API_URL_BACKPACK}/klines?symbol=${market}&interval=1d&startTime=1714865400`,
   );
   const klineData: KLine[] = await kline.json();

   return klineData.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}

export async function getDepth(market: string): Promise<Depth> {
   const depth = await fetch(`${API_URL_BACKPACK}/depth?symbol=${market}`);

   return await depth.json();
}

export async function getTickers() {
   const res = await fetch(`${API_URL_BACKPACK}/tickers`);
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
            imageUrl: symbolInfo.imageUrl,
         });
      }
      return acc;
   }, []);

   return tickerData;
}
