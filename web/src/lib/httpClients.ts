import { Depth, KLine } from './types';

// const BACKEND_URL = 'http://localhost:3001/api/v1';
const BACKEND_URL = 'https://api.backpack.exchange/api/v1';

export async function getKlines(market: string): Promise<KLine[]> {
   const kline = await fetch(
      `${BACKEND_URL}/klines?symbol=${market}&interval=1d&startTime=1714865400`,
   );
   const klineData: KLine[] = await kline.json();

   return klineData.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}

//api.backpack.exchange/api/v1/klines?symbol=BTC_USDC&interval=1d&startTime=1714865400

export async function getDepth(market: string): Promise<Depth> {
   const depth = await fetch(`${BACKEND_URL}/depth?symbol=${market}`);

   console.log('depth', depth);
   return await depth.json();
}
