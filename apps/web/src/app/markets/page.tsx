import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow
} from '@/components/ui/table';
import { auth } from '@/lib/auth';
import { getTickers } from '@/lib/http-clients';
import { formatPrice, formatVolume } from '@/lib/utils';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Markets() {
   const tickerData = await getTickers();

   const session = await auth.api.getSession({
      headers: await headers()
   });

   if (!session) {
      redirect('/auth');
   }

   return (
      <div className="w-full p-2">
         <div className="bg-base-background-l0 text-high-emphasis flex flex-1 flex-col overflow-auto">
            <div className="flex flex-col flex-1 gap-8">
               <div className="flex flex-col mx-auto w-full max-w-7xl flex-1 gap-4 px-3 sm:px-3">
                  <div className="flex flex-col">
                     {/* upper analytics */}
                     <div className=""></div>

                     {/* lower table */}
                     <div className="flex flex-col bg-base-background-l1 flex-1 gap-3 rounded-xl p-4">
                        {/* tab */}
                        <div className="flex flex-row">
                           <div className="items-center justify-center flex-row flex gap-2">
                              <div className="flex justify-center flex-col cursor-pointer rounded-lg py-1 font-medium outline-hidden hover:opacity-90 text-high-emphasis px-3 text-sm h-8 bg-base-background-l2">
                                 Spot
                              </div>
                              <div className="flex justify-center flex-col cursor-pointer rounded-lg py-1 font-medium outline-hidden hover:opacity-90 text-med-emphasis px-3 text-sm h-8">
                                 Futures
                              </div>
                              <div className="flex justify-center flex-col cursor-pointer rounded-lg py-1 font-medium outline-hidden hover:opacity-90 text-med-emphasis px-3 text-sm h-8">
                                 Lending
                              </div>
                           </div>
                        </div>

                        {/* table */}
                        <div className="overflow-x-auto">
                           <Table className="min-w-full ">
                              <TableHeader>
                                 <TableRow>
                                    <TableHead className="border-b border-base-border-light px-1 py-3 text-sm font-normal text-med-emphasis first:pl-2 last:pr-6">
                                       <div className="flex flex-row items-center px-1 first:pl-0 cursor-pointer select-none justify-start text-left">
                                          Name
                                       </div>
                                    </TableHead>
                                    <TableHead className="border-b border-base-border-light w-[17%] px-1 py-3 text-sm font-normal text-med-emphasis first:pl-2 last:pr-6">
                                       <div className="flex flex-row items-center px-1 first:pl-0 cursor-pointer select-none justify-end text-right">
                                          Price
                                       </div>
                                    </TableHead>
                                    <TableHead className="border-b border-base-border-light w-[17%] px-1 py-3 text-sm font-normal text-med-emphasis first:pl-2 last:pr-6">
                                       <div className="flex flex-row items-center px-1 first:pl-0 cursor-pointer select-none justify-end text-right">
                                          24h Volume
                                       </div>
                                    </TableHead>
                                    <TableHead className="border-b border-base-border-light w-[17%] px-1 py-3 text-sm font-normal text-med-emphasis first:pl-2 last:pr-6">
                                       <div className="flex flex-row items-center px-1 first:pl-0 cursor-pointer select-none justify-end text-right">
                                          24h Change
                                       </div>
                                    </TableHead>
                                    <TableHead className="border-b border-base-border-light w-[17%] px-1 py-3 text-sm font-normal text-med-emphasis first:pl-2 last:pr-6">
                                       <div className="flex flex-row items-center px-1 first:pl-0 cursor-pointer select-none justify-end text-right">
                                          Last 7 Days
                                       </div>
                                    </TableHead>
                                 </TableRow>
                              </TableHeader>

                              <TableBody className="gap-2 divide-y">
                                 {tickerData.map((crypto: any, idx: number) => (
                                    <TableRow
                                       key={idx + 1}
                                       className="border-b border-[#1C1F26] hover:bg-[#1C1F26] transition-colors"
                                    >
                                       <TableCell className="py-4">
                                          <Link
                                             href={`/trade/${crypto.symbol}`}
                                          >
                                             <div className="flex items-center">
                                                <div className="size-8 mr-3 rounded-full overflow-hidden bg-[#1C1F26]">
                                                   <img
                                                      src={crypto.imageUrl}
                                                      alt=""
                                                      className="object-cover w-full h-full"
                                                   />
                                                </div>
                                                <div>
                                                   <div className="font-semibold text-[#F7F8F8]">
                                                      {crypto.name}
                                                   </div>
                                                   <div className="text-[#9DA3B3] text-sm">
                                                      {
                                                         crypto.symbol.split(
                                                            '_'
                                                         )[0]
                                                      }
                                                      /
                                                      {
                                                         crypto.symbol.split(
                                                            '_'
                                                         )[1]
                                                      }
                                                   </div>
                                                </div>
                                             </div>
                                          </Link>
                                       </TableCell>
                                       <TableCell className="text-right font-medium text-[#F7F8F8]">
                                          {Number(crypto.price) > 0.1 ? (
                                             formatPrice(crypto.price)
                                          ) : (
                                             <span>$ {crypto.price}</span>
                                          )}
                                       </TableCell>
                                       <TableCell className="text-right text-[#9DA3B3]">
                                          ${formatVolume(crypto.volume)}
                                       </TableCell>
                                       <TableCell
                                          className={`${
                                             crypto.change > 0
                                                ? 'text-[#00C278]'
                                                : 'text-[#FF3B3B]'
                                          } text-right font-medium`}
                                       >
                                          {crypto.change > 0 ? '+' : ''}
                                          {crypto.change}%
                                       </TableCell>
                                       <TableCell className="text-right pr-6">
                                          {crypto.change > 0 ? (
                                             <span className="text-[#00C278]">
                                                ↑
                                             </span>
                                          ) : (
                                             <span className="text-[#FF3B3B]">
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
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
