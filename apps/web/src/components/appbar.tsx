/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from './user-button';

export default function Appbar({ disable }: Readonly<{ disable?: boolean }>) {
   const route = usePathname();

   return (
      <div className="relative flex h-12 sm:h-14 lg:h-16 w-full flex-row justify-between px-4 sm:px-6 lg:px-8 xl:px-12">
         <div className="flex items-center flex-row">
            <div className="text-lg sm:text-xl lg:text-xl font-bold flex flex-col justify-center cursor-pointer text-white">
               <Link href="/">
                  <div className="flex items-center space-x-2">
                     <div className="h-6 w-6 sm:h-7 sm:w-7">
                        <img src="/logo.png" alt="logo img" />
                     </div>
                     <p className="hidden sm:block">Suitcase</p>
                  </div>
               </Link>
            </div>
            <div
               className={`text-xs sm:text-sm lg:text-sm pt-1 flex flex-col justify-center pl-4 sm:pl-6 lg:pl-8 ${
                  disable
                     ? 'text-slate-400 pointer-events-none'
                     : route.startsWith('/markets')
                       ? 'text-white cursor-pointer'
                       : 'text-slate-500 cursor-pointer hover:text-white transition-colors'
               }`}
            >
               <Link href={disable ? '#' : '/markets'}>Markets</Link>
            </div>
            {/* Trade nav item: always disable pointer events on /markets page */}
            <div
               className={`text-xs sm:text-sm lg:text-sm pt-1 flex flex-col justify-center pl-4 sm:pl-6 lg:pl-8 ${
                  disable || route.startsWith('/markets')
                     ? 'text-slate-400 pointer-events-none'
                     : route.startsWith('/trade')
                       ? 'text-white cursor-pointer'
                       : 'text-slate-500 cursor-pointer hover:text-white transition-colors'
               }`}
            >
               <Link href="#">Trade</Link>
            </div>
         </div>

         <div className="flex items-center">
            <div className="flex items-center space-x-2">
               {!disable && <UserButton />}
            </div>
         </div>
      </div>
   );
}
