/* eslint-disable @next/next/no-img-element */
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { getTickers } from '@/lib/httpClients';
import { formatPrice, formatVolume } from '@/lib/utils';
import Link from 'next/link';

export default async function Markets() {
   const tickerData = await getTickers();

   return (
      <div className="w-full bg-black text-white p-4 rounded-lg">
         <div className="flex items-center mb-6">
            <div className="text-2xl font-bold mr-6 flex items-center">
               <span className="bg-gray-800 p-1 rounded mr-2">💼</span>Suitcase
            </div>
         </div>

         <div className="mb-4">
            <div className="flex space-x-4">
               <span className="font-semibold border-b-2 border-white pb-2">
                  Spot
               </span>
               <span className="text-gray-400">Futures</span>
               <span className="text-gray-400">Lending</span>
            </div>
         </div>

         <Table className="bg-[#14151b]">
            <TableHeader className="bg-gray-900">
               <TableRow>
                  <TableHead className="text-gray-400">Name</TableHead>
                  <TableHead className="text-gray-400 text-right">
                     Price
                  </TableHead>
                  <TableHead className="text-gray-400 text-right">
                     24h Volume
                  </TableHead>

                  <TableHead className="text-gray-400 text-right">
                     24h Change
                  </TableHead>
                  <TableHead className="text-gray-400 text-right">
                     Last 7 Days
                  </TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {tickerData.map((crypto: any, idx: number) => (
                  <TableRow className="border-b border-gray-800" key={idx + 1}>
                     <TableCell>
                        <Link href={`/trade/${crypto.symbol}`}>
                           <div className="flex items-center">
                              <div className="size-8 mr-2 rounded-full overflow-hidden">
                                 <img
                                    src={crypto.imageUrl}
                                    alt=""
                                    className="object-cover w-full h-full"
                                 />
                              </div>
                              <div>
                                 <div className="font-medium text-white">
                                    {crypto.name}
                                 </div>
                                 <div className="text-gray-400 text-sm">
                                    {crypto.symbol}
                                 </div>
                              </div>
                           </div>
                        </Link>
                     </TableCell>
                     <TableCell className="text-right font-medium">
                        {Number(crypto.price) > 0.1 ? (
                           formatPrice(crypto.price)
                        ) : (
                           <span className="">$ {crypto.price}</span>
                        )}
                     </TableCell>
                     <TableCell className="text-right">
                        ${formatVolume(crypto.volume)}
                     </TableCell>
                     <TableCell
                        className={`${crypto.change > 0 ? 'text-green-500' : 'text-red-500'} text-right`}
                     >
                        {crypto.change} %
                     </TableCell>
                     <TableCell className="text-right">
                        {crypto.change > 0 ? (
                           <span className="text-green-500">📈</span>
                        ) : (
                           <span className="text-red-500">📉</span>
                        )}
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
