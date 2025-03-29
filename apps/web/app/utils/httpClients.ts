import { KLine } from './types';

export async function getKlines(market: string): Promise<KLine[]> {
   const kline = await fetch(
      `https://api.backpack.exchange/api/v1/klines?symbol=${market}&interval=1month&startTime=1698777000`,
   );
   const klineData: KLine[] = await kline.json();

   return klineData.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}
