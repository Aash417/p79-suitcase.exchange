'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Appbar() {
   const route = usePathname();

   return (
      <div className="flex justify-between items-center ">
         <div className="flex">
            <div className="text-xl font-bold pl-4 flex flex-col justify-center cursor-pointer text-white">
               <Link href="/">💼 Suitcase</Link>
            </div>
            <div
               className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${route.startsWith('/markets') ? 'text-white' : 'text-slate-500'}`}
            >
               <Link href="/markets">Markets</Link>
            </div>
            <div
               className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${route.startsWith('/trade') ? 'text-white' : 'text-slate-500'}`}
            >
               <Link href="/trade">Trade</Link>
            </div>
         </div>
      </div>
   );
}
