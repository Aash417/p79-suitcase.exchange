import { MarketsTrades } from '@/features/marketTrades/market-trades';
import { auth } from '@/lib/auth';
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

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <MarketsTrades />
      </HydrationBoundary>
   );
}
