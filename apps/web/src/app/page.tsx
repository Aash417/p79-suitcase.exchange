import { TradingDashboardMock } from '@/components/trading-dashboard-mock';
import { UserButton } from '@/components/user-button';
import { auth } from '@/lib/auth';
import { WebSocketManager } from '@/lib/websocket-manager';
import { ArrowRight, Shield, Star, TrendingUp, Zap } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';

const cryptos = [
   {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: '$67,420',
      change: '+2.4%',
      positive: true
   },
   {
      symbol: 'ETH',
      name: 'Ethereum',
      price: '$3,840',
      change: '+1.8%',
      positive: true
   },
   {
      symbol: 'SOL',
      name: 'Solana',
      price: '$198',
      change: '-0.5%',
      positive: false
   },
   {
      symbol: 'ADA',
      name: 'Cardano',
      price: '$0.68',
      change: '+3.2%',
      positive: true
   }
];

export default async function Page() {
   WebSocketManager.getInstance();
   const session = await auth.api.getSession({
      headers: await headers()
   });

   return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] via-[#181c23] to-[#0a0e17] text-white overflow-hidden relative">
         {/* Subtle background blur and floating shapes */}
         <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-1/2 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-2xl" />
         </div>
         {/* Navigation */}
         <nav className="relative z-50 px-4 sm:px-8 py-4 flex justify-between items-center max-w-7xl mx-auto">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
               Suitcase
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
               {session ? (
                  <UserButton />
               ) : (
                  <Link
                     href="/auth"
                     className="px-5 py-2 border border-gray-700/60 rounded-xl text-base font-semibold bg-black/30 hover:border-purple-400 transition-all shadow-sm backdrop-blur-md"
                  >
                     Login
                  </Link>
               )}
            </div>
         </nav>

         {/* Hero Section */}
         <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 min-w-[300px]">
               <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight drop-shadow-xl">
                  Trade Crypto
                  <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
                     Like a Pro
                  </span>
               </h1>
               <p className="text-lg sm:text-2xl text-gray-300 mb-10 leading-relaxed max-w-xl">
                  Join millions of traders on the world&apos;s most secure
                  crypto exchange. Start with as little as $10 and access 350+
                  cryptocurrencies.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link
                     href={session ? '/markets' : '/auth'}
                     className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl text-lg font-bold shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                     Start Trading Now
                     <ArrowRight className="ml-2" size={22} />
                  </Link>
               </div>
               {/* Live Price Ticker */}
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {cryptos.map((crypto) => (
                     <div
                        key={crypto.symbol}
                        className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-gray-700/60 shadow-md flex flex-col items-start gap-1 hover:border-cyan-400/60 transition-all"
                     >
                        <div className="flex justify-between items-center w-full mb-1">
                           <span className="text-sm font-bold tracking-wide text-white/90">
                              {crypto.symbol}
                           </span>
                           <span
                              className={`text-xs px-2 py-1 rounded font-semibold ${crypto.positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                           >
                              {crypto.change}
                           </span>
                        </div>
                        <div className="text-lg font-semibold">
                           {crypto.price}
                        </div>
                        <div className="text-xs text-gray-400">
                           {crypto.name}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <div className="flex-1 flex justify-center items-center w-full">
               <div className="relative w-full max-w-md mx-auto">
                  <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400/30 to-purple-400/30 rounded-3xl blur-xl z-0" />
                  <div className="relative z-10">
                     <TradingDashboardMock />
                  </div>
               </div>
            </div>
         </section>

         {/* Features Section */}
         <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="text-center mb-10 sm:mb-16">
               <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                  Why Choose{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                     Suitcase
                  </span>
               </h2>
               <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto">
                  Built for both beginners and professionals with
                  enterprise-grade security and lightning-fast execution.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
               <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700 hover:border-purple-500/50 transition-all group">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                     <Shield size={32} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                     Bank-Grade Security
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                     Your funds are protected by military-grade encryption and
                     cold storage technology used by major financial
                     institutions.
                  </p>
               </div>

               <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700 hover:border-purple-500/50 transition-all group">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                     <Zap size={32} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                     Lightning Fast
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                     Execute trades in milliseconds with our advanced matching
                     engine and global server infrastructure.
                  </p>
               </div>

               <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700 hover:border-purple-500/50 transition-all group">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                     <TrendingUp size={32} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                     Advanced Tools
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                     Professional charting, algorithmic trading, and portfolio
                     management tools for serious traders.
                  </p>
               </div>
            </div>
         </section>

         {/* Social Proof */}
         <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="text-center">
               <h2 className="text-2xl sm:text-4xl font-bold mb-8 sm:mb-12">
                  Trusted by Millions
               </h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-12">
                  <div className="text-center">
                     <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        50M+
                     </div>
                     <div className="text-gray-400">Users Worldwide</div>
                  </div>
                  <div className="text-center">
                     <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        $500B+
                     </div>
                     <div className="text-gray-400">Trading Volume</div>
                  </div>
                  <div className="text-center">
                     <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                        350+
                     </div>
                     <div className="text-gray-400">Cryptocurrencies</div>
                  </div>
                  <div className="text-center">
                     <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        24/7
                     </div>
                     <div className="text-gray-400">Support</div>
                  </div>
               </div>

               <div className="flex justify-center items-center space-x-1 sm:space-x-2 mb-4 sm:mb-8">
                  {[...Array(5)].map((_, i) => (
                     <Star
                        key={i}
                        size={20}
                        className="text-yellow-400 fill-current"
                     />
                  ))}
                  <span className="ml-1 sm:ml-2 text-base sm:text-lg">
                     4.8/5 from 100K+ reviews
                  </span>
               </div>
            </div>
         </section>

         {/* CTA Section */}
         <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl p-6 sm:p-12 text-center border border-gray-700">
               <h2 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
                  Ready to Start Trading?
               </h2>
               <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Join Suitcase today and get $1000 in free USD to start
               </p>
               <Link
                  href={session ? '/markets' : '/auth'}
                  className="px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-lg sm:text-xl font-bold hover:shadow-2xl hover:shadow-purple-500/25 transition-all transform hover:scale-105"
               >
                  Get Started Now
               </Link>
               <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-400">
                  No fees for your first 30 days • Instant verification • Start
                  with $1000
               </div>
            </div>
         </section>

         {/* Footer */}
         <footer className="relative z-10 border-t border-gray-800 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
                  <div>
                     <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        Suitcase
                     </div>
                     <p className="text-gray-400">
                        The world&apos;s leading cryptocurrency exchange
                        platform.
                     </p>
                  </div>
                  <div>
                     <h4 className="font-semibold mb-4">Products</h4>
                     <div className="space-y-2 text-gray-400">
                        <div>Spot Trading</div>
                        <div>Margin Trading</div>
                        <div>Futures</div>
                        <div>Options</div>
                     </div>
                  </div>
                  <div>
                     <h4 className="font-semibold mb-4">Company</h4>
                     <div className="space-y-2 text-gray-400">
                        <div>About Us</div>
                        <div>Careers</div>
                        <div>Security</div>
                        <div>Press</div>
                     </div>
                  </div>
                  <div>
                     <h4 className="font-semibold mb-4">Support</h4>
                     <div className="space-y-2 text-gray-400">
                        <div>Help Center</div>
                        <div>Contact Us</div>
                        <div>API Docs</div>
                        <div>Status</div>
                     </div>
                  </div>
               </div>
               <div className="w-full pt-6 sm:pt-8 mt-6 sm:mt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs sm:text-base">
                  <p className="text-[2.5vw] md:text-[1.5vw] lg:text-[1vw] mb-[1vh] md:mb-0">
                     © {new Date().getFullYear()} SNACKIT. All rights reserved.
                  </p>
                  <p className="text-[2.5vw] md:text-[1.5vw] lg:text-[1vw]">
                     Created by{' '}
                     <Link
                        href="https://twitter.com/aashish_kathait"
                        className="hover:text-white transition-colors duration-300"
                     >
                        @aashish_k
                     </Link>
                  </p>
               </div>
            </div>
         </footer>
      </div>
   );
}
