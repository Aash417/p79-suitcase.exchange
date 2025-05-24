'use client';

import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger
} from './ui/dropdown-menu';

export default function Appbar() {
   const { data: session } = authClient.useSession();
   const route = usePathname();
   const router = useRouter();

   return (
      <div className="relative flex h-14 w-full flex-row justify-between">
         <div className="flex items-center flex-row">
            <div className="text-xl font-bold pl-4 flex flex-col justify-center cursor-pointer text-white">
               <Link href="/">💼 Suitcase</Link>
            </div>
            <div
               className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${
                  route.startsWith('/markets') ? 'text-white' : 'text-slate-500'
               }`}
            >
               <Link href="/markets">Markets</Link>
            </div>
            <div
               className={`text-sm pt-1 flex flex-col justify-center pl-8  ${
                  route.startsWith('/trade') ? 'text-white' : 'text-slate-500'
               }`}
            >
               Trade
            </div>
         </div>

         <div className="flex items-center pr-4">
            <div className="flex items-center space-x-2">
               <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer">
                     <div className="size-8 mr-3 rounded-full overflow-hidden bg-[#1C1F26]">
                        <img
                           src={session?.user?.image ?? '/user.png'}
                           alt=""
                           className="object-cover w-full h-full"
                        />
                     </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                     align="end"
                     side="bottom"
                     sideOffset={10}
                     className="bg-base-background-l2 border-[#9DA3B3]"
                  >
                     <DropdownMenuItem
                        className="cursor-pointer text-center"
                        onClick={() =>
                           authClient.signOut({
                              fetchOptions: {
                                 onSuccess: () => {
                                    router.push('/');
                                 }
                              }
                           })
                        }
                     >
                        Logout
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>
      </div>
   );
}
