import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
// If your Prisma file is located elsewhere, you can change the path
import prisma from '@repo/db/index';

export const auth = betterAuth({
   database: prismaAdapter(prisma, {
      provider: 'postgresql'
   }),

   socialProviders: {
      google: {
         clientId: process.env.GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
      }
   }
});
