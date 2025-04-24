import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

export default function Markets() {
   const cryptoData = [
      {
         name: 'Bitcoin',
         symbol: 'BTC/USDC',
         icon: '🟠',
         price: '$82,500.00',
         volume: '$4.6M',
         marketCap: '$1.6T',
         change: '-0.63 %',
         trend: '↘️',
         color: 'text-red-500',
      },
      {
         name: 'Ethereum',
         symbol: 'ETH/USDC',
         icon: '🔷',
         price: '$1,819.99',
         volume: '$3.1M',
         marketCap: '$219.9B',
         change: '-0.67 %',
         trend: '↘️',
         color: 'text-red-500',
      },
      {
         name: 'USDT',
         symbol: 'USDT/USDC',
         icon: '🟢',
         price: '$0.9997',
         volume: '$2M',
         marketCap: '$143.9B',
         change: '+0.02 %',
         trend: '↗️',
         color: 'text-green-500',
      },
      {
         name: 'Solana',
         symbol: 'SOL/USDC',
         icon: '🟣',
         price: '$124.66',
         volume: '$24.2M',
         marketCap: '$63.8B',
         change: '-0.12 %',
         trend: '↘️',
         color: 'text-red-500',
      },
      {
         name: 'Chainlink',
         symbol: 'LINK/USDC',
         icon: '🔵',
         price: '$13.29',
         volume: '$46.5K',
         marketCap: '$8.5B',
         change: '-2.82 %',
         trend: '↘️',
         color: 'text-red-500',
      },
      {
         name: 'Shiba Inu',
         symbol: 'SHIB/USDC',
         icon: '🦊',
         price: '$0.0000122',
         volume: '$11.7K',
         marketCap: '$7.2B',
         change: '-3.62 %',
         trend: '↘️',
         color: 'text-red-500',
      },
      {
         name: 'Uniswap',
         symbol: 'UNI/USDC',
         icon: '🦄',
         price: '$5.944',
         volume: '$30K',
         marketCap: '$3.6B',
         change: '-0.54 %',
         trend: '↘️',
         color: 'text-red-500',
      },
      {
         name: 'Pepe',
         symbol: 'PEPE/USDC',
         icon: '🐸',
         price: '$0.00000705',
         volume: '$19.4K',
         marketCap: '$3B',
         change: '-0.08 %',
         trend: '↘️',
         color: 'text-red-500',
      },
      {
         name: 'Ondo',
         symbol: 'ONDO/USDC',
         icon: '⭕',
         price: '$0.768',
         volume: '$157.1K',
         marketCap: '$2.4B',
         change: '-4.24 %',
         trend: '↘️',
         color: 'text-red-500',
      },
   ];

   return (
      <div className="w-full bg-black text-white p-4 rounded-lg">
         <div className="flex items-center mb-6">
            <div className="text-2xl font-bold mr-6 flex items-center">
               <span className="bg-red-600 p-1 rounded mr-2">💼</span>Suitcase
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
                     <div className="flex items-center justify-end">
                        Market Cap
                        {/* <ChevronDown size={16} className="ml-1" /> */}
                     </div>
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
               {cryptoData.map((crypto) => (
                  <TableRow
                     className="border-b border-gray-800"
                     key={crypto.name}
                  >
                     <TableCell>
                        <Link
                           href={`/trade/${crypto.symbol.replace('/', '_')}`}
                        >
                           <div className="flex items-center">
                              <span className="text-2xl mr-3">
                                 {crypto.icon}
                              </span>
                              <div>
                                 <div className="font-medium">
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
                        {crypto.price}
                     </TableCell>
                     <TableCell className="text-right">
                        {crypto.volume}
                     </TableCell>
                     <TableCell className="text-right">
                        {crypto.marketCap}
                     </TableCell>
                     <TableCell className={`text-right ${crypto.color}`}>
                        {crypto.change}
                     </TableCell>
                     <TableCell className="text-right">
                        {crypto.trend}
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
