import { MaintenanceModal } from '@/components/maintenance-modal';
import { QueryProvider } from '@/components/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
   src: './fonts/GeistVF.woff',
   variable: '--font-geist-sans'
});
const geistMono = localFont({
   src: './fonts/GeistMonoVF.woff',
   variable: '--font-geist-mono'
});

export const metadata: Metadata = {
   title: 'suitcase.exchange',
   description: 'Crypto trading platform, for seamless exchange'
};

export default function RootLayout({
   children
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={`${geistSans.variable} ${geistMono.variable}`}>
            <QueryProvider>
               {children}
               <MaintenanceModal />
               <ReactQueryDevtools initialIsOpen={false} />
            </QueryProvider>
            <Toaster position="top-center" />
            <Analytics />
         </body>
      </html>
   );
}
