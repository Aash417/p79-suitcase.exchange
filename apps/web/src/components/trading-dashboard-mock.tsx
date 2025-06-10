'use client';

import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function TradingDashboardMock() {
   const [currentPrice, setCurrentPrice] = useState(99420);
   const [priceChange, setPriceChange] = useState(2.4);
   const [chartData, setChartData] = useState<number[]>([]);

   // Generate chart data only on the client
   useEffect(() => {
      setChartData(Array.from({ length: 15 }, () => 30 + Math.random() * 70));
   }, []);

   // Simulate live price updates and chart data updates
   useEffect(() => {
      const interval = setInterval(() => {
         const change = (Math.random() - 0.5) * 100;
         setCurrentPrice((prev) => Math.max(60000, prev + change));
         setPriceChange((Math.random() - 0.5) * 5);
         setChartData(
            Array.from({ length: 15 }, () => 30 + Math.random() * 70)
         );
      }, 2000);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 shadow-2xl">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">BTC/USD</h3>
            <div className="flex items-center space-x-2">
               <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
               <span className="text-sm text-gray-400">Live</span>
            </div>
         </div>

         <div className="mb-6">
            <div className="text-3xl font-bold mb-2">
               ${currentPrice.toLocaleString()}
            </div>
            <div
               className={`flex items-center ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}
            >
               <TrendingUp size={16} />
               <span className="ml-1">
                  {priceChange >= 0 ? '+' : ''}
                  {priceChange.toFixed(2)}%
               </span>
            </div>
         </div>

         {/* Chart Placeholder */}
         <div className="h-32 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg mb-6 flex items-end p-4">
            {chartData.map((height, i) => (
               <div
                  key={i + 1}
                  className="bg-gradient-to-t from-cyan-400 to-purple-400 w-4 mr-2 rounded-t"
                  style={{ height: `${height}%` }}
               ></div>
            ))}
         </div>

         <div className="grid grid-cols-2 gap-4">
            <button className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors">
               Buy
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors">
               Sell
            </button>
         </div>
      </div>
   );
}
