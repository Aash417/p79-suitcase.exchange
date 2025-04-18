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
         {/* <div className="flex">
            <SuccessButton>Deposit</SuccessButton>
            <PrimaryButton>Withdraw</PrimaryButton>
         </div> */}
      </div>
   );
}

export const PrimaryButton = ({
   children,
   onClick,
}: {
   children: string;
   onClick?: () => void;
}) => {
   return (
      <button
         type="button"
         className="text-center font-semibold rounded-lg focus:ring-blue-200 focus:none focus:outline-none hover:opacity-90 disabled:opacity-80 disabled:hover:opacity-80 relative overflow-hidden h-[32px] text-sm px-3 py-1.5 mr-4 "
      >
         <div className="absolute inset-0 bg-blue-500 opacity-[16%]"></div>
         <div className="flex flex-row items-center justify-center gap-4">
            <p className="text-blue-500">{children}</p>
         </div>
      </button>
   );
};

export const SuccessButton = ({
   children,
   onClick,
}: {
   children: string;
   onClick?: () => void;
}) => {
   return (
      <button
         type="button"
         className="text-center font-semibold rounded-lg focus:ring-green-200 focus:none focus:outline-none hover:opacity-90 disabled:opacity-80 disabled:hover:opacity-80 relative overflow-hidden h-[32px] text-sm px-3 py-1.5 mr-4 "
      >
         <div className="absolute inset-0 bg-green-500 opacity-[16%]"></div>
         <div className="flex flex-row items-center justify-center gap-4">
            <p className="text-green-500">{children}</p>
         </div>
      </button>
   );
};
