/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';

export default function SignIn() {
   return (
      <div className="relative h-[90vh] w-full bg-base-background-l0 font-sans">
         {/* Full-screen background image */}
         <Image
            src="/background.svg"
            alt="trading background"
            className="absolute top-0 left-0 h-full w-full object-cover opacity-10"
            width={1920}
            height={1080}
         />

         {/* Card on top of the background */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-background-l2 rounded-2xl">
            <div className="sm:h-[25vh] h-[24vh] w-[80vw] sm:w-[25vw] flex flex-col  justify-between rounded-2xl bg-base-background-l2 shadow-lg bg-opacity-90">
               <div className="flex flex-col items-center justify-center gap-2 p-2">
                  <div className="h-[5vh] w-[5vh]">
                     <img src="/logo.png" alt="" />
                  </div>
                  <h1 className="font-semibold text-2xl ">Sign in</h1>
               </div>

               <div className="p-4">
                  <Button
                     variant="outline"
                     size="lg"
                     className="bg-white text-black h-12 rounded-xl px-4 py-2 text-center text-balance font-semibold hover:opacity-90 w-full cursor-pointer"
                     onClick={() => {
                        authClient.signIn.social({
                           provider: 'google',
                           callbackURL: '/markets'
                        });
                     }}
                  >
                     <FcGoogle className="mr-2 size-6" />
                     Signin with Google
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
