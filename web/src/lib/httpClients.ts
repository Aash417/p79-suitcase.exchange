import { KLine } from '@/features/klineChart/utils/types';
import { Depth } from '@/features/orderbook/utils/types';
import { API_URL_BACKPACK } from './env';

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

export async function getTickers(market: string) {
   const tickers = await fetch(`${API_URL_BACKPACK}/ticker?symbol=${market}`);
   const tickerData = await tickers.json();

   return tickerData;
}
