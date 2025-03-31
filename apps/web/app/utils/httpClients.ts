import { Depth, KLine } from './types';

export async function getKlines(market: string): Promise<KLine[]> {
   const kline = await fetch(
      `https://api.backpack.exchange/api/v1/klines?symbol=${market}&interval=1d&startTime=1714865400`,
   );
   const klineData: KLine[] = await kline.json();

   return klineData.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}

//api.backpack.exchange/api/v1/klines?symbol=BTC_USDC&interval=1d&startTime=1714865400

export async function getDepth(market: string): Promise<Depth> {
   const depth = await fetch(
      `https://api.backpack.exchange/api/v1/depth?symbol=${market}`,
   );

   return await depth.json();
}
