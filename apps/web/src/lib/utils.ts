import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SYMBOLS_MAP } from './constants';
import { API_URL } from './env';
import { Ticker } from './types';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export const formatPrice = (price: string | number) => {
   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
   }).format(Number(price));
};

export const formatVolume = (value: string | number): string => {
   const num = Number(value);

   if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B';
   } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';
   } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K';
   } else return num.toFixed(2);
};

export const formatComma = (value: string | number): string => {
   return new Intl.NumberFormat('en-US').format(Number(value));
};

export async function getTickers() {
   const res = await fetch(`${API_URL}/tickers`);
   const data: Ticker[] = await res.json();

   const tickersData = data.reduce((acc: unknown[], ticker: Ticker) => {
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

   return tickersData;
}
