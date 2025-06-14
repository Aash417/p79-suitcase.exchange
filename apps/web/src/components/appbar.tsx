/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from './user-button';

export default function Appbar({ disable }: Readonly<{ disable?: boolean }>) {
   const route = usePathname();

   return (
      <div className="relative flex flex-row justify-between w-full h-12 px-5 sm:h-13 lg:h-14 2xl:h-20 2xl:px-8">
         <div className="flex flex-row items-center">
            <div className="flex flex-col justify-center text-lg font-bold text-white cursor-pointer sm:text-xl lg:text-xl 2xl:text-2xl">
               <Link href="/">
                  <div className="flex items-center space-x-2">
                     <div className="h-7 w-7 2xl:h-9 2xl:w-9">
                        <img src="/logo.png" alt="logo img" />
                     </div>
                     <p className="hidden sm:block">Suitcase</p>
                  </div>
               </Link>
            </div>
            <div
               className={`text-sm 2xl:text-lg pt-1 flex flex-col justify-center pl-4 sm:pl-6 lg:pl-8 2xl:pl-10 ${
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
               className={`text-sm 2xl:text-lg pt-1 flex flex-col justify-center pl-4 sm:pl-6 lg:pl-8 2xl:pl-10 ${
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
