import { MarketsTrades } from '@/features/marketTrades/market-trades';
import { fetchMarketDepth, fetchTicker, fetchUserBalance } from '@/hooks';
import { auth } from '@/lib/auth';
import { SYMBOLS } from '@/lib/constants';
import {
   dehydrate,
   HydrationBoundary,
   QueryClient
} from '@tanstack/react-query';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Market() {
   const queryClient = new QueryClient();

   const session = await auth.api.getSession({
      headers: await headers()
   });

   if (!session) {
      redirect('/auth');
   }

   await queryClient.prefetchQuery({
      queryKey: ['userBalance'],
      queryFn: () => fetchUserBalance(session.user.id)
   });

   const depthPrefetchPromises = SYMBOLS.map(({ symbol }) =>
      queryClient.prefetchQuery({
         queryKey: ['depth', symbol],
         queryFn: () => fetchMarketDepth(symbol)
      })
   );
   const tickerPrefetchPromises = SYMBOLS.map(({ symbol }) =>
      queryClient.prefetchQuery({
         queryKey: ['ticker', symbol],
         queryFn: () => fetchTicker(symbol)
      })
   );

   // Wait for all data to be prefetched
   await Promise.all(depthPrefetchPromises);
   await Promise.all(tickerPrefetchPromises);

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <MarketsTrades />
      </HydrationBoundary>
   );
}
