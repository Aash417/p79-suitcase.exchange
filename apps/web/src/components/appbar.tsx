/* eslint-disable @next/next/no-img-element */
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

export default function Appbar({ disable }: Readonly<{ disable?: boolean }>) {
   const { data: session } = authClient.useSession();
   const route = usePathname();
   const router = useRouter();

   const name = session?.user?.name.split(' ')[0].charAt(0).toUpperCase();

   return (
      <div className="relative flex h-14 w-full flex-row justify-between">
         <div className="flex items-center flex-row">
            <div className="text-xl font-bold pl-4 flex flex-col justify-center cursor-pointer text-white">
               <Link href="/">
                  <div className="flex items-center space-x-2">
                     <div className="h-7 w-7">
                        <img src="/logo.png" alt="logo img" />
                     </div>
                     <p> Suitcase</p>
                  </div>
               </Link>
            </div>
            <div
               className={`text-sm pt-1 flex flex-col justify-center pl-8 ${
                  disable
                     ? 'text-slate-400 pointer-events-none'
                     : route.startsWith('/markets')
                       ? 'text-white cursor-pointer'
                       : 'text-slate-500 cursor-pointer'
               }`}
            >
               <Link href={disable ? '#' : '/markets'}>Markets</Link>
            </div>
            <div
               className={`text-sm pt-1 flex flex-col justify-center pl-8 ${
                  disable
                     ? 'text-slate-400 pointer-events-none'
                     : route.startsWith('/trade')
                       ? 'text-white cursor-pointer'
                       : 'text-slate-500 cursor-pointer'
               }`}
            >
               <Link href={disable ? '#' : '/trade'}>Trade</Link>
            </div>
         </div>

         <div className="flex items-center pr-4">
            <div className="flex items-center space-x-2">
               {!disable && (
                  <DropdownMenu>
                     <DropdownMenuTrigger className="cursor-pointer">
                        <div className="size-8 mr-3 rounded-full overflow-hidden bg-[#1C1F26]">
                           {name ? (
                              <div className="flex items-center justify-center h-full w-full text-white">
                                 {name}
                              </div>
                           ) : (
                              <img
                                 src={'/user.png'}
                                 alt=""
                                 className="object-cover w-full h-full"
                              />
                           )}
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
               )}
            </div>
         </div>
      </div>
   );
}
