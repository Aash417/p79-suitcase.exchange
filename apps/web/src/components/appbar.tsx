/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from './user-button';

export default function Appbar({ disable }: Readonly<{ disable?: boolean }>) {
   const route = usePathname();

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
            {/* Trade nav item: always disable pointer events on /markets page */}
            <div
               className={`text-sm pt-1 flex flex-col justify-center pl-8 ${
                  disable || route.startsWith('/markets')
                     ? 'text-slate-400 pointer-events-none'
                     : route.startsWith('/trade')
                       ? 'text-white cursor-pointer'
                       : 'text-slate-500 cursor-pointer'
               }`}
            >
               <Link href="#">Trade</Link>
            </div>
         </div>

         <div className="flex items-center pr-4">
            <div className="flex items-center space-x-2">
               {!disable && <UserButton />}
            </div>
         </div>
      </div>
   );
}
