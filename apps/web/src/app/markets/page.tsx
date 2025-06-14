/* eslint-disable @next/next/no-img-element */
interface TickerData {
   symbol: string;
   imageUrl: string;
   name: string;
   price: string;
   volume: string;
   change: number;
}

import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow
} from '@/components/ui/table';
import { auth } from '@/lib/auth';
import { addNewUser, formatPrice, formatVolume, getTickers } from '@/lib/utils';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Markets() {
   const session = await auth.api.getSession({
      headers: await headers()
   });
   if (!session) redirect('/auth');

   const userId = session?.user.id;
   await addNewUser(userId);

   const tickersData = (await getTickers()) as TickerData[];

   return (
      <div className="flex flex-col w-full h-screen p-4 rounded-xl md:py-2 md:px-4 2xl:px-6">
         {/* Top section: 10% height */}
         <div className="h-[10%] bg-base-background-l1 rounded-t-xl">
            <div className="flex flex-row items-center h-full px-4 2xl:px-6">
               <div className="flex flex-row items-center justify-center gap-2">
                  <div className="flex flex-col justify-center h-8 px-3 py-1 text-sm font-medium rounded-lg cursor-pointer 2xl:px-4 2xl:py-2 outline-hidden hover:opacity-90 text-high-emphasis 2xl:text-xl 2xl:h-10 bg-base-background-l2">
                     Spot
                  </div>
                  <div className="flex flex-col justify-center h-8 px-3 py-1 text-sm font-medium rounded-lg pointer-events-none text-med-emphasis 2xl:text-xl 2xl:h-10">
                     Futures
                  </div>
                  <div className="flex flex-col justify-center h-8 px-3 py-1 text-sm font-medium rounded-lg pointer-events-none 2xl:px-4 2xl:py-2 text-med-emphasis 2xl:text-xl 2xl:h-10">
                     Lending
                  </div>
               </div>
            </div>
         </div>

         {/* Middle section: 50% height */}
         <div className="px-4 pb-4 overflow-auto bg-base-background-l1 rounded-b-xl 2xl:px-6">
            <Table className="min-w-full">
               <TableHeader>
                  <TableRow>
                     <TableHead className="px-1 py-3 text-sm font-normal border-b border-base-border-light 2xl:py-4 2xl:text-base text-med-emphasis first:pl-2 last:pr-6">
                        <div className="flex flex-row items-center justify-start px-1 text-left select-none first:pl-0">
                           Name
                        </div>
                     </TableHead>
                     <TableHead className="border-b border-base-border-light w-[17%] px-1 py-3 2xl:py-4 text-sm 2xl:text-base font-normal text-med-emphasis first:pl-2 last:pr-6">
                        <div className="flex flex-row items-center justify-end px-1 text-right select-none first:pl-0">
                           Price
                        </div>
                     </TableHead>
                     <TableHead className="border-b border-base-border-light w-[17%] px-1 py-3 2xl:py-4 text-sm 2xl:text-base font-normal text-med-emphasis first:pl-2 last:pr-6 hidden sm:table-cell">
                        <div className="flex flex-row items-center justify-end px-1 text-right select-none first:pl-0">
                           24h Volume
                        </div>
                     </TableHead>
                     <TableHead className="border-b border-base-border-light w-[17%] px-1 py-3 2xl:py-4 text-sm 2xl:text-base font-normal text-med-emphasis first:pl-2 last:pr-6">
                        <div className="flex flex-row items-center justify-end px-1 text-right select-none first:pl-0">
                           24h Change
                        </div>
                     </TableHead>
                     <TableHead className="border-b border-base-border-light w-[17%] px-1 py-3 2xl:py-4 text-sm 2xl:text-base font-normal text-med-emphasis first:pl-2 last:pr-6 hidden lg:table-cell">
                        <div className="flex flex-row items-center justify-end px-1 text-right select-none first:pl-0">
                           Last 7 Days
                        </div>
                     </TableHead>
                  </TableRow>
               </TableHeader>

               <TableBody className="gap-2 divide-y">
                  {tickersData.map((crypto: TickerData, idx: number) => (
                     <TableRow
                        key={idx + 1}
                        className="border-b border-[#1C1F26] hover:bg-[#1C1F26] transition-colors"
                     >
                        <TableCell className="py-3 sm:py-4 2xl:py-5">
                           <Link href={`/trade/${crypto.symbol}`}>
                              <div className="flex items-center">
                                 <div className="size-6 sm:size-8 2xl:size-10 mr-2 sm:mr-3 2xl:mr-4 rounded-full overflow-hidden bg-[#1C1F26]">
                                    <img
                                       src={crypto.imageUrl}
                                       alt=""
                                       className="object-cover w-full h-full"
                                    />
                                 </div>
                                 <div>
                                    <div className="font-semibold text-[#F7F8F8] text-sm sm:text-base 2xl:text-lg">
                                       {crypto.name}
                                    </div>
                                    <div className="text-[#9DA3B3] text-xs sm:text-sm 2xl:text-base">
                                       {crypto.symbol.split('_')[0]}/
                                       {crypto.symbol.split('_')[1]}
                                    </div>
                                 </div>
                              </div>
                           </Link>
                        </TableCell>

                        <TableCell className="text-right font-medium text-[#F7F8F8] text-sm sm:text-base 2xl:text-lg">
                           {Number(crypto.price) > 0.1 ? (
                              formatPrice(crypto.price)
                           ) : (
                              <span>$ {crypto.price}</span>
                           )}
                        </TableCell>

                        <TableCell className="text-right text-[#9DA3B3] text-sm sm:text-base 2xl:text-lg hidden sm:table-cell">
                           ${formatVolume(crypto.volume)}
                        </TableCell>

                        <TableCell
                           className={`${
                              crypto.change > 0
                                 ? 'text-[#00C278]'
                                 : 'text-[#FF3B3B]'
                           } text-right font-medium text-sm sm:text-base 2xl:text-lg`}
                        >
                           {crypto.change}%
                        </TableCell>

                        <TableCell className="hidden pr-4 text-right sm:pr-6 2xl:pr-8 lg:table-cell">
                           {crypto.change > 0 ? (
                              <span className="text-[#00C278] text-lg 2xl:text-xl">
                                 ↑
                              </span>
                           ) : (
                              <span className="text-[#FF3B3B] text-lg 2xl:text-xl">
                                 ↓
                              </span>
                           )}
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}
