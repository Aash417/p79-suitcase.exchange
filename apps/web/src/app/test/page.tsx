'use client';
import {
   Camera,
   ChevronDown,
   Maximize2,
   RefreshCw,
   Settings
} from 'lucide-react';
import { useState } from 'react';

const BackpackTradingUI = () => {
   const [activeTab, setActiveTab] = useState('Chart');
   const [activeOrderType, setActiveOrderType] = useState('Market');

   return (
      <div className="w-full min-h-screen bg-black text-white">
         {/* Header */}
         <header className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center space-x-8">
               <div className="flex items-center">
                  <span className="text-red-500 text-2xl mr-2">🔒</span>
                  <span className="text-xl font-bold">Backpack</span>
               </div>
               <nav className="flex items-center space-x-6">
                  <span className="font-medium text-white">Spot</span>
                  <span className="text-gray-400">Futures</span>
                  <span className="text-gray-400">Lend</span>
                  <div className="flex items-center text-gray-400">
                     <span>More</span>
                     <ChevronDown size={16} className="ml-1" />
                  </div>
               </nav>
            </div>
            <div className="flex items-center">
               <button className="bg-green-600 text-white px-4 py-2 rounded mr-2">
                  Sign up
               </button>
               <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  Sign in
               </button>
            </div>
         </header>

         {/* Ticker and Trading Info */}
         <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
               <div className="flex items-center">
                  <div className="flex items-center mr-6">
                     <span className="bg-yellow-500 text-xl rounded-full mr-2">
                        ₿
                     </span>
                     <span className="font-medium">BTC/USDC</span>
                     <ChevronDown size={16} className="ml-1" />
                  </div>
                  <div>
                     <div className="text-green-500 text-2xl font-bold">
                        85,028.4
                     </div>
                     <div className="text-sm">$85,028.40</div>
                  </div>
               </div>

               <div className="flex items-center space-x-8">
                  <div>
                     <div className="text-gray-400 text-xs">24H Change</div>
                     <div className="text-green-500">+1,295.7 +1.55%</div>
                  </div>
                  <div>
                     <div className="text-gray-400 text-xs">24H High</div>
                     <div>85,531.3</div>
                  </div>
                  <div>
                     <div className="text-gray-400 text-xs">24H Low</div>
                     <div>82,544.5</div>
                  </div>
                  <div>
                     <div className="text-gray-400 text-xs">
                        24H Volume (USDC)
                     </div>
                     <div>6,912,708.24</div>
                  </div>
                  <div className="flex space-x-2">
                     <button className="bg-gray-800 hover:bg-gray-700 px-8 py-2 rounded">
                        Buy
                     </button>
                     <button className="bg-gray-800 hover:bg-gray-700 text-red-500 px-8 py-2 rounded">
                        Sell
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Main Content */}
         <div className="flex">
            {/* Chart Panel */}
            <div className="w-2/3 border-r border-gray-800">
               <div className="flex border-b border-gray-800">
                  <button
                     className={`px-6 py-3 ${activeTab === 'Chart' ? 'border-b-2 border-white' : 'text-gray-400'}`}
                     onClick={() => setActiveTab('Chart')}
                  >
                     Chart
                  </button>
                  <button
                     className={`px-6 py-3 ${activeTab === 'Depth' ? 'border-b-2 border-white' : 'text-gray-400'}`}
                     onClick={() => setActiveTab('Depth')}
                  >
                     Depth
                  </button>
                  <button
                     className={`px-6 py-3 ${activeTab === 'Margin' ? 'border-b-2 border-white' : 'text-gray-400'}`}
                     onClick={() => setActiveTab('Margin')}
                  >
                     Margin
                  </button>
                  <div className="ml-auto flex items-center border-l border-gray-800 px-6">
                     <button
                        className={`px-6 py-3 ${activeTab === 'Book' ? 'border-b-2 border-white' : 'text-gray-400'}`}
                     >
                        Book
                     </button>
                     <button
                        className={`px-6 py-3 ${activeTab === 'Trades' ? 'border-b-2 border-white' : 'text-gray-400'}`}
                     >
                        Trades
                     </button>
                  </div>
               </div>

               {/* Chart Controls */}
               <div className="p-3 flex items-center border-b border-gray-800">
                  <div className="flex space-x-4 text-gray-400">
                     <button className="p-2">D</button>
                     <button className="p-2">📈</button>
                     <button className="p-2">📉</button>
                     <button className="p-2 text-blue-500">OL</button>
                     <button className="p-2">TE</button>
                     <button className="p-2">↺</button>
                     <button className="p-2">↻</button>
                  </div>
                  <div className="ml-auto flex space-x-4 text-gray-400">
                     <button className="p-2">
                        <Settings size={16} />
                     </button>
                     <button className="p-2">
                        <Maximize2 size={16} />
                     </button>
                     <button className="p-2">
                        <Camera size={16} />
                     </button>
                     <button className="p-2">Reset</button>
                  </div>
               </div>

               {/* Chart Area */}
               <div className="h-96 p-4 relative">
                  <div className="absolute top-0 left-0 p-4 text-xs">
                     <div>BTC_USDC • 1D • Backpack</div>
                     <div>
                        <span className="text-red-500">O:85195.8</span>
                        <span className="text-green-500 ml-2">H:85323.7</span>
                        <span className="text-red-500 ml-2">L:83925.8</span>
                        <span className="text-red-500 ml-2">C:85028.4</span>
                        <span className="text-red-500 ml-2">
                           -152.0 (-0.18%)
                        </span>
                     </div>
                  </div>

                  {/* Placeholder for the chart */}
                  <div className="w-full h-full flex items-center justify-center">
                     <div className="text-gray-600">
                        [Price Chart Visualization Would Be Here]
                     </div>
                  </div>

                  <div className="absolute bottom-4 left-4 text-xs">
                     <div>Volume SMA 58.93</div>
                  </div>

                  <div className="absolute bottom-4 right-4 text-xs">
                     <div>58.93</div>
                  </div>
               </div>

               {/* Chart Footer */}
               <div className="p-3 flex items-center justify-between border-t border-gray-800 text-sm">
                  <div className="flex space-x-4">
                     <button className="px-2">All</button>
                     <button className="px-2">1y</button>
                     <button className="px-2">6m</button>
                     <button className="px-2">3m</button>
                     <button className="px-2">1m</button>
                     <button className="px-2">5d</button>
                     <button className="px-2 text-blue-500">1d</button>
                     <button className="px-2">📅</button>
                  </div>
                  <div className="text-gray-400">18:34:05 (UTC+5:30)</div>
                  <div className="flex space-x-4">
                     <button className="px-2">%</button>
                     <button className="px-2">log</button>
                     <button className="px-2 text-blue-500">auto</button>
                  </div>
               </div>
            </div>

            {/* Order Book Panel */}
            <div className="w-1/3 p-4">
               {/* Order Type Tabs */}
               <div className="flex mb-4 bg-gray-900 rounded overflow-hidden">
                  <button
                     className={`flex-1 py-2 text-center ${activeOrderType === 'Limit' ? 'bg-gray-800' : ''}`}
                     onClick={() => setActiveOrderType('Limit')}
                  >
                     Limit
                  </button>
                  <button
                     className={`flex-1 py-2 text-center ${activeOrderType === 'Market' ? 'bg-gray-800' : ''}`}
                     onClick={() => setActiveOrderType('Market')}
                  >
                     Market
                  </button>
                  <button
                     className={`flex-1 py-2 text-center ${activeOrderType === 'Conditional' ? 'bg-gray-800' : ''}`}
                     onClick={() => setActiveOrderType('Conditional')}
                  >
                     Conditional
                  </button>
               </div>

               {/* Order Details */}
               <div className="space-y-4">
                  <div className="flex justify-between">
                     <span className="text-gray-400">Balance</span>
                     <span>0 BTC</span>
                  </div>

                  <div className="flex justify-between items-center">
                     <span className="text-gray-400">Quantity</span>
                     <div className="flex items-center">
                        <RefreshCw size={14} className="mr-2" />
                        <span>≈ 84,873.4 USDC</span>
                     </div>
                  </div>

                  {/* Quantity Input */}
                  <div className="relative">
                     <input
                        type="text"
                        value="1"
                        className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-right"
                     />
                     <div className="absolute right-3 top-3 text-yellow-500">
                        ₿
                     </div>
                  </div>

                  {/* Slider */}
                  <div className="py-2">
                     <div className="relative w-full h-1 bg-gray-800 rounded-full">
                        <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-blue-500 rounded-full"></div>
                        <div className="absolute left-1/3 top-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2"></div>
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                           0
                        </div>
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                           100%
                        </div>
                     </div>
                  </div>

                  {/* Order Book */}
                  <div className="mt-8">
                     <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 mb-2">
                        <div>Price (USDC)</div>
                        <div className="text-center">Size (BTC)</div>
                        <div className="text-right">Total (BTC)</div>
                     </div>

                     {/* Sell orders (red) */}
                     {[
                        {
                           price: '85,045.0',
                           size: '0.03726',
                           total: '0.28667',
                           color: 'text-red-500'
                        },
                        {
                           price: '85,042.9',
                           size: '0.03609',
                           total: '0.24941',
                           color: 'text-red-500'
                        },
                        {
                           price: '85,042.1',
                           size: '0.00587',
                           total: '0.21332',
                           color: 'text-red-500'
                        },
                        {
                           price: '85,040.8',
                           size: '0.03609',
                           total: '0.20745',
                           color: 'text-red-500'
                        },
                        {
                           price: '85,038.6',
                           size: '0.03609',
                           total: '0.17136',
                           color: 'text-red-500'
                        },
                        {
                           price: '85,037.9',
                           size: '0.05879',
                           total: '0.13527',
                           color: 'text-red-500'
                        },
                        {
                           price: '85,037.7',
                           size: '0.07527',
                           total: '0.07648',
                           color: 'text-red-500'
                        },
                        {
                           price: '85,037.5',
                           size: '0.00060',
                           total: '0.00121',
                           color: 'text-red-500'
                        },
                        {
                           price: '85,037.4',
                           size: '0.00061',
                           total: '0.00061',
                           color: 'text-red-500'
                        }
                     ].map((order, index) => (
                        <div
                           key={index}
                           className={`grid grid-cols-3 gap-4 text-sm ${order.color}`}
                        >
                           <div>{order.price}</div>
                           <div className="text-center">{order.size}</div>
                           <div className="text-right">{order.total}</div>
                        </div>
                     ))}

                     {/* Current price */}
                     <div className="grid grid-cols-3 gap-4 text-sm text-green-500 py-2 border-y border-gray-800 my-2">
                        <div>85,028.4</div>
                        <div className="col-span-2"></div>
                     </div>

                     {/* Buy orders (green) */}
                     {[
                        {
                           price: '85,036.8',
                           size: '0.04797',
                           total: '0.04797',
                           color: 'text-green-500'
                        },
                        {
                           price: '85,034.9',
                           size: '0.05880',
                           total: '0.10677',
                           color: 'text-green-500'
                        },
                        {
                           price: '85,033.4',
                           size: '0.03528',
                           total: '0.14205',
                           color: 'text-green-500'
                        },
                        {
                           price: '85,032.3',
                           size: '0.03609',
                           total: '0.17814',
                           color: 'text-green-500'
                        },
                        {
                           price: '85,030.2',
                           size: '0.03609',
                           total: '0.21423',
                           color: 'text-green-500'
                        },
                        {
                           price: '85,028.1',
                           size: '0.03609',
                           total: '0.25032',
                           color: 'text-green-500'
                        },
                        {
                           price: '85,026.0',
                           size: '0.03609',
                           total: '0.28641',
                           color: 'text-green-500'
                        }
                     ].map((order, index) => (
                        <div
                           key={index}
                           className={`grid grid-cols-3 gap-4 text-sm ${order.color}`}
                        >
                           <div>{order.price}</div>
                           <div className="text-center">{order.size}</div>
                           <div className="text-right">{order.total}</div>
                        </div>
                     ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 space-y-2">
                     <button className="w-full bg-white text-black font-medium py-3 rounded">
                        Sign up to trade
                     </button>
                     <button className="w-full bg-transparent border border-gray-600 text-white font-medium py-3 rounded">
                        Sign in to trade
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default BackpackTradingUI;
