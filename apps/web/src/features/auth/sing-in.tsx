'use client';

import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader
} from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { FcGoogle } from 'react-icons/fc';

export default function SignIn() {
   return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-base-background-l0 px-4 font-sans">
         <Card className="mx-auto w-[23vw] bg-base-background-l2 shadow-lg ">
            <CardHeader>
               <CardDescription className="text-[#9DA3B3]">
                  Seamless one click signin with google.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid gap-4">
                  <Button
                     variant="outline"
                     size="lg"
                     className="border-[#9DA3B3]"
                     onClick={() => {
                        authClient.signIn.social({
                           provider: 'google',
                           callbackURL: '/markets'
                        });
                     }}
                  >
                     <FcGoogle className="mr-2 size-5" />
                     Signin with Google
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
