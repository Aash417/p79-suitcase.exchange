import { KLine } from '@/features/klineChart/utils/types';
import { Depth } from '@/features/orderbook/utils/types';
import { SYMBOLS_MAP } from '@/lib/constants';
import { API_URL } from '@/lib/env';
import { Ticker, Trades } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Mutations

type OrderReq = {
   market: string;
   price: string;
   quantity: string;
   side: string;
   userId: string;
};

export function useExecuteOrder(market: string) {
   const queryClient = useQueryClient();
   const mutation = useMutation<ResponseType, Error, OrderReq>({
      mutationFn: async (data) => {
         const response = await fetch(`${API_URL}/order`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               accept: '*/*'
            },
            body: JSON.stringify(data)
         });

         if (!response.ok) {
            throw new Error('Failed to execute order');
         }

         return await response.json();
      },
      onSuccess: () => {
         toast.success('Order created successfully', { duration: 1300 });
         queryClient.invalidateQueries({ queryKey: ['userBalance'] });
         queryClient.invalidateQueries({ queryKey: [market] });
      },
      onError: (error) => {
         toast.error(error.message || 'Failed to create order', {
            duration: 1300
         });
      }
   });
   return mutation;
}

type DepositReq = {
   asset: string;
   quantity: string;
   userId: string;
};

export function useDepositAsset() {
   const queryClient = useQueryClient();
   const mutation = useMutation<ResponseType, Error, DepositReq>({
      mutationFn: async (data) => {
         const response = await fetch(`${API_URL}/order/on-ramp`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               accept: '*/*'
            },
            body: JSON.stringify(data)
         });
         if (!response.ok) {
            throw new Error('Failed to deposit asset');
         }

         return await response.json();
      },
      onSuccess: () => {
         toast.success('Asset added successfully', { duration: 1300 });
         queryClient.invalidateQueries({ queryKey: ['userBalance'] });
      },
      onError: (error) => {
         toast.error(error.message || 'Failed to deposit asset', {
            duration: 1300
         });
      }
   });
   return mutation;
}

// Query

type userBalRes = {
   [key: string]: {
      available: number;
      locked: number;
   };
};

export function useGetUserBalances(userId: string) {
   return useQuery<userBalRes>({
      queryKey: ['userBalance'],
      queryFn: () => fetchUserBalance(userId),
      retry: 2,
      refetchOnWindowFocus: true,
      staleTime: 30000 // Consider data fresh for 30 seconds
   });
}

export function useGetUserOpenOrders(market: string, userId: string) {
   return useQuery<
      {
         id: string;
         price: string;
         quantity: string;
         side: string;
      }[]
   >({
      queryKey: [market],
      queryFn: () => fetchUserOpenOrders(market, userId),
      retry: 2,
      refetchOnWindowFocus: true,
      staleTime: 30000
   });
}

export function useGetKline(market: string) {
   return useQuery<KLine[]>({
      queryKey: ['kline', market],
      queryFn: () => fetchKline(market),
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 60000 // Consider data fresh for 1 minute
   });
}

export function useGetDepth(market: string) {
   return useQuery<Depth>({
      queryKey: ['depth', market],
      queryFn: () => fetchMarketDepth(market),
      retry: 2,
      refetchOnWindowFocus: true,
      staleTime: 30000
   });
}

export function useGetTickers() {
   return useQuery({
      queryKey: ['tickers'],
      queryFn: async () => {
         const response = await fetch(`${API_URL}/tickers`);
         if (!response.ok) {
            throw new Error('Failed to fetch tickers');
         }

         const data: Ticker[] = await response.json();

         const tickerData = data.reduce((acc: unknown[], ticker: Ticker) => {
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
      },
      retry: 2,
      refetchOnWindowFocus: true,
      staleTime: 30000 // Consider data fresh for 30 seconds
   });
}

export function useGetTicker(market: string) {
   return useQuery({
      queryKey: ['ticker', market],
      queryFn: () => fetchTicker(market),
      retry: 2,
      refetchOnWindowFocus: true,
      staleTime: 10000 // Consider data fresh for 10 seconds
   });
}

export function useGetTrades(market: string) {
   return useQuery<Trades[]>({
      queryKey: ['trades', market],
      queryFn: () => fetchTrades(market),
      retry: 2,
      refetchOnWindowFocus: true,
      staleTime: 5000 // Consider data fresh for 10 seconds
   });
}

//helpers

export async function fetchUserBalance(userId: string) {
   const response = await fetch(`${API_URL}/capital?userId=${userId}`);
   if (!response.ok) throw new Error('Failed to fetch user balances');

   const data = await response.json();
   return data;
}

export async function fetchUserOpenOrders(market: string, userId: string) {
   const response = await fetch(
      `${API_URL}/order/open?symbol=${market}&userId=${userId}`
   );
   if (!response.ok) {
      throw new Error('Failed to fetch user balances');
   }

   const data = await response.json();
   return data;
}

export async function fetchKline(market: string) {
   const response = await fetch(
      `${API_URL}/klines?symbol=${market}&interval=1d&startTime=1714865400`
   );
   if (!response.ok) {
      throw new Error('Failed to fetch klines');
   }

   const klineData: KLine[] = await response.json();
   return klineData.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}

export async function fetchMarketDepth(market: string) {
   const response = await fetch(`${API_URL}/depth?symbol=${market}`);
   if (!response.ok) {
      throw new Error('Failed to fetch depth');
   }

   const depthData = await response.json();
   const final = {
      ...depthData,
      bids: [...depthData.bids].reverse(), // Highest first
      asks: [...depthData.asks] // Lowest first (already sorted)
   };
   return final;
}

export async function fetchTicker(market: string) {
   const response = await fetch(`${API_URL}/ticker?symbol=${market}`);
   if (!response.ok) {
      throw new Error('Failed to fetch ticker');
   }

   const data: Ticker = await response.json();
   const symbolInfo = SYMBOLS_MAP.get(data.symbol);

   return {
      ...data,
      change: (Number(data.priceChangePercent) * 100).toFixed(2),
      name: symbolInfo?.name ?? '',
      imageUrl: symbolInfo?.imageUrl ?? ''
   };
}

export async function fetchTrades(market: string) {
   const response = await fetch(`${API_URL}/trades?symbol=${market}&limit=30`);
   if (!response.ok) {
      throw new Error('Failed to fetch trades');
   }

   const data: Trades[] = await response.json();
   return data;
}
