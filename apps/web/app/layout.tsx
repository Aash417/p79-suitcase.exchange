import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
   title: 'crypto trader',
   description: 'crafted by @aashish',
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body>{children}</body>
      </html>
   );
}
