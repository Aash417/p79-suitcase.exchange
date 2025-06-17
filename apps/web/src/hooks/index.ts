import { SYMBOLS_MAP } from '@/lib/constants';
import { API_URL } from '@/lib/env';
import type {
   Balances,
   Candlesticks,
   Depth,
   ExecuteOrder,
   OnRamp,
   OpenOrders,
   TickerType,
   Trades
} from '@repo/shared-types/messages/client-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Mutations

export function useExecuteOrder() {
   const queryClient = useQueryClient();
   const mutation = useMutation<string, Error, ExecuteOrder>({
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

         return data.userId;
      },
      onSuccess: (userId) => {
         toast.success('Order created successfully', { duration: 1300 });
         queryClient.invalidateQueries({
            queryKey: ['userBalance', userId]
         });
         queryClient.invalidateQueries({
            queryKey: ['userOpenOrders', userId]
         });
      },
      onError: (error) => {
         toast.error(error.message || 'Failed to create order', {
            duration: 1300
         });
      }
   });
   return mutation;
}

export function useDepositAsset() {
   const queryClient = useQueryClient();
   const mutation = useMutation<string, Error, OnRamp>({
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

         return data.userId;
      },
      onSuccess: (userId) => {
         toast.success('Asset added successfully', { duration: 1300 });
         queryClient.invalidateQueries({
            queryKey: ['userBalance', userId]
         });
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

export function useGetUserBalances(userId: string) {
   return useQuery({
      queryKey: ['userBalance', userId],
      queryFn: () => fetchUserBalance(userId),
      retry: 2,
      refetchOnWindowFocus: true,
      staleTime: 30_000
   });
}

export function useGetUserOpenOrders(userId: string) {
   return useQuery({
      queryKey: ['userOpenOrders', userId],
      queryFn: () => fetchUserOpenOrders(userId),
      retry: 2,
      refetchOnWindowFocus: true,
      staleTime: 30000
   });
}

export function useGetKline(market: string) {
   return useQuery({
      queryKey: ['kline', market],
      queryFn: () => fetchKline(market),
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 60000
   });
}

export function useGetDepth(market: string) {
   return useQuery({
      queryKey: ['depth', market],
      queryFn: () => fetchMarketDepth(market),
      retry: 2,
      refetchOnWindowFocus: true,
      staleTime: 30000
   });
}

export function useGetTickers() {
   type accType = {
      symbol: string;
      price: string;
      volume: string;
      change: string;
      name: string;
      imageUrl: string;
   };

   return useQuery({
      queryKey: ['tickers'],
      queryFn: async () => {
         const response = await fetch(`${API_URL}/tickers`);
         if (!response.ok) {
            throw new Error('Failed to fetch tickers');
         }

         const data: TickerType[] = await response.json();

         const tickerData = data.reduce(
            (acc: accType[], ticker: TickerType) => {
               const symbolInfo = SYMBOLS_MAP.get(ticker.symbol);
               if (symbolInfo) {
                  acc.push({
                     symbol: ticker.symbol,
                     price: ticker.lastPrice,
                     volume: ticker.quoteVolume,
                     change: (Number(ticker.priceChangePercent) * 100).toFixed(
                        2
                     ),
                     name: symbolInfo.name,
                     imageUrl: symbolInfo.imageUrl
                  });
               }
               return acc;
            },
            []
         );

         return tickerData;
      },
      retry: 2,
      refetchOnWindowFocus: true,
      staleTime: 30000
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
   return useQuery({
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

   const data: Balances = await response.json();
   return data;
}

export async function fetchUserOpenOrders(userId: string) {
   const url = `${API_URL}/order/open?userId=${userId}`;

   const response = await fetch(url);
   if (!response.ok) {
      throw new Error('Failed to fetch user orders');
   }

   const data: OpenOrders = await response.json();
   return data;
}

export async function fetchKline(market: string) {
   const response = await fetch(
      `${API_URL}/klines?symbol=${market}&interval=1d&startTime=1714865400`
   );
   if (!response.ok) {
      throw new Error('Failed to fetch klines');
   }

   const klineData: Candlesticks = await response.json();
   return klineData.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}

export async function fetchMarketDepth(market: string) {
   const response = await fetch(`${API_URL}/depth?symbol=${market}`);
   if (!response.ok) {
      throw new Error('Failed to fetch depth');
   }

   const depthData: Depth = await response.json();
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

   const result: TickerType = await response.json();
   const symbolInfo = SYMBOLS_MAP.get(result.symbol);

   const data = {
      ...result,
      change: (Number(result.priceChangePercent) * 100).toFixed(2),
      name: symbolInfo?.name ?? '',
      imageUrl: symbolInfo?.imageUrl ?? ''
   };

   return data;
}

export async function fetchTrades(market: string) {
   const response = await fetch(`${API_URL}/trades?symbol=${market}&limit=30`);
   if (!response.ok) {
      throw new Error('Failed to fetch trades');
   }

   const data: Trades = await response.json();
   return data;
}
