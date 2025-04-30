import Appbar from '@/components/appbar';
import React from 'react';

type Props = {
   children: React.ReactNode;
};

export default function Layout({ children }: Readonly<Props>) {
   return (
      <div className="flex flex-col max-h-screen min-h-screen overflow-y-hidden">
         <div className="bg-base-background-l0 sticky top-0 z-20 w-full">
            <div className="relative flex h-14 w-full flex-col justify-center">
               <Appbar />
            </div>
         </div>

         {children}
      </div>
   );
}
