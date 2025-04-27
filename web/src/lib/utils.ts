import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export const formatPrice = (price: string | number) => {
   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
