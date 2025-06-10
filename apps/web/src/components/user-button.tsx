/* eslint-disable @next/next/no-img-element */
'use client';

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export function UserButton() {
   const { data: session } = authClient.useSession();
   const router = useRouter();

   const name = session?.user?.name.split(' ')[0].charAt(0).toUpperCase();
   return (
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
   );
}
