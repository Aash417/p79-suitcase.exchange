import SignIn from '@/features/auth/sing-in';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
   const session = await auth.api.getSession({
      headers: await headers()
   });

   if (!!session) {
      redirect('/markets');
   }

   return <SignIn />;
}
