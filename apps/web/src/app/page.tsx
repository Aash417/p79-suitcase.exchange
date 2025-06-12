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
      price: '$97,420',
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
         <nav className="relative z-50 px-4 sm:px-8 lg:px-12 2xl:px-16 py-4 flex justify-between items-center w-full">
            <div className="text-2xl lg:text-2xl 2xl:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
               Suitcase
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
               {session ? (
                  <UserButton />
               ) : (
                  <Link
                     href="/auth"
                     className="px-5 py-2 border border-gray-700/60 rounded-xl text-base lg:text-base 2xl:text-xl font-semibold bg-black/30 hover:border-purple-400 transition-all shadow-sm backdrop-blur-md"
                  >
                     Login
                  </Link>
               )}
            </div>
         </nav>

         {/* Hero Section */}
         <section className="relative z-10 w-full px-4 sm:px-8 lg:px-12 2xl:px-16 py-12 sm:py-16 lg:py-20 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            <div className="flex-1 min-w-[300px] max-w-none">
               <h1 className="text-4xl sm:text-5xl lg:text-6xl 2xl:text-8xl font-extrabold mb-6 leading-tight tracking-tight drop-shadow-xl">
                  Trade Crypto{' '}
                  <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
                     Like a Pro
                  </span>
               </h1>
               <p className="text-lg sm:text-xl lg:text-xl 2xl:text-3xl text-gray-300 mb-8 lg:mb-10 leading-relaxed">
                  Join millions of traders on the world&apos;s most secure
                  crypto exchange.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 mb-8 lg:mb-10">
                  <Link
                     href={session ? '/markets' : '/auth'}
                     className="px-6 lg:px-8 2xl:px-10 py-3 lg:py-4 2xl:py-5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl text-base lg:text-lg 2xl:text-2xl font-bold shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                     Start Trading Now
                     <ArrowRight className="ml-2" size={20} />
                  </Link>
               </div>
               {/* Live Price Ticker */}
               <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-4 gap-4">
                  {cryptos.map((crypto) => (
                     <div
                        key={crypto.symbol}
                        className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-gray-700/60 shadow-md flex flex-col items-start gap-1 hover:border-cyan-400/60 transition-all"
                     >
                        <div className="flex justify-between items-center w-full mb-1">
                           <span className="text-sm lg:text-sm 2xl:text-lg font-bold tracking-wide text-white/90">
                              {crypto.symbol}
                           </span>
                           <span
                              className={`text-xs lg:text-xs 2xl:text-base px-2 py-1 rounded font-semibold ${crypto.positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                           >
                              {crypto.change}
                           </span>
                        </div>
                        <div className="text-lg lg:text-lg 2xl:text-2xl font-semibold">
                           {crypto.price}
                        </div>
                        <div className="text-xs lg:text-xs 2xl:text-base text-gray-400">
                           {crypto.name}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <div className="flex-1 flex justify-center items-center w-full lg:max-w-none">
               <div className="relative w-full max-w-md lg:max-w-md 2xl:max-w-lg mx-auto">
                  <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400/30 to-purple-400/30 rounded-3xl blur-xl z-0" />
                  <div className="relative z-10">
                     <TradingDashboardMock />
                  </div>
               </div>
            </div>
         </section>

         {/* Features Section */}
         <section className="relative z-10 w-full px-4 sm:px-8 lg:px-12 2xl:px-16 py-12 sm:py-16 lg:py-20">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16">
               <h2 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-6xl font-bold mb-4 sm:mb-6">
                  Why Choose{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                     Suitcase
                  </span>
               </h2>
               <p className="text-base sm:text-lg lg:text-xl 2xl:text-3xl text-gray-300 max-w-3xl mx-auto">
                  Built for both beginners and professionals with
                  enterprise-grade security and lightning-fast execution.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
               <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700 hover:border-purple-500/50 transition-all group">
                  <div className="w-14 h-14 lg:w-16 2xl:w-20 lg:h-16 2xl:h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                     <Shield
                        size={28}
                        className="lg:w-8 2xl:w-10 lg:h-8 2xl:h-10"
                     />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-2xl 2xl:text-4xl font-bold mb-3 sm:mb-4">
                     Bank-Grade Security
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-base 2xl:text-xl">
                     Your funds are protected by military-grade encryption and
                     cold storage technology used by major financial
                     institutions.
                  </p>
               </div>

               <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700 hover:border-purple-500/50 transition-all group">
                  <div className="w-14 h-14 lg:w-16 2xl:w-20 lg:h-16 2xl:h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                     <Zap
                        size={28}
                        className="lg:w-8 2xl:w-10 lg:h-8 2xl:h-10"
                     />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-2xl 2xl:text-4xl font-bold mb-3 sm:mb-4">
                     Lightning Fast
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-base 2xl:text-xl">
                     Execute trades in milliseconds with our advanced matching
                     engine and global server infrastructure.
                  </p>
               </div>

               <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700 hover:border-purple-500/50 transition-all group">
                  <div className="w-14 h-14 lg:w-16 2xl:w-20 lg:h-16 2xl:h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                     <TrendingUp
                        size={28}
                        className="lg:w-8 2xl:w-10 lg:h-8 2xl:h-10"
                     />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-2xl 2xl:text-4xl font-bold mb-3 sm:mb-4">
                     Advanced Tools
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-base 2xl:text-xl">
                     Professional charting, algorithmic trading, and portfolio
                     management tools for serious traders.
                  </p>
               </div>
            </div>
         </section>

         {/* Social Proof */}
         <section className="relative z-10 w-full px-4 sm:px-8 lg:px-12 2xl:px-16 py-12 sm:py-16 lg:py-20">
            <div className="text-center">
               <h2 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-6xl font-bold mb-8 sm:mb-10 lg:mb-12">
                  Trusted by Millions
               </h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-10 mb-8 sm:mb-10 lg:mb-12">
                  <div className="text-center">
                     <div className="text-3xl sm:text-4xl lg:text-4xl 2xl:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        50M+
                     </div>
                     <div className="text-gray-400 text-sm sm:text-base lg:text-lg 2xl:text-xl">
                        Users Worldwide
                     </div>
                  </div>
                  <div className="text-center">
                     <div className="text-3xl sm:text-4xl lg:text-4xl 2xl:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        $500B+
                     </div>
                     <div className="text-gray-400 text-sm sm:text-base lg:text-lg 2xl:text-xl">
                        Trading Volume
                     </div>
                  </div>
                  <div className="text-center">
                     <div className="text-3xl sm:text-4xl lg:text-4xl 2xl:text-6xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                        350+
                     </div>
                     <div className="text-gray-400 text-sm sm:text-base lg:text-lg 2xl:text-xl">
                        Cryptocurrencies
                     </div>
                  </div>
                  <div className="text-center">
                     <div className="text-3xl sm:text-4xl lg:text-4xl 2xl:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        24/7
                     </div>
                     <div className="text-gray-400 text-sm sm:text-base lg:text-lg 2xl:text-xl">
                        Support
                     </div>
                  </div>
               </div>

               <div className="flex justify-center items-center space-x-1 sm:space-x-2 mb-4 sm:mb-8">
                  {[...Array(5)].map((_, i) => (
                     <Star
                        key={i + 1}
                        size={18}
                        className="text-yellow-400 fill-current lg:w-5 2xl:w-7 lg:h-5 2xl:h-7"
                     />
                  ))}
                  <span className="ml-1 sm:ml-2 text-base sm:text-lg lg:text-lg 2xl:text-2xl">
                     4.8/5 from 100K+ reviews
                  </span>
               </div>
            </div>
         </section>

         {/* CTA Section */}
         <section className="relative z-10 w-full px-4 sm:px-8 lg:px-12 2xl:px-16 py-12 sm:py-16 lg:py-20">
            <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl p-6 sm:p-10 lg:p-12 2xl:p-16 text-center border border-gray-700">
               <h2 className="text-3xl sm:text-4xl lg:text-4xl 2xl:text-6xl font-bold mb-4 sm:mb-6">
                  Ready to Start Trading?
               </h2>
               <p className="text-base sm:text-lg lg:text-xl 2xl:text-3xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto">
                  Join Suitcase today and get $1000 in free USD to start
               </p>
               <Link
                  href={session ? '/markets' : '/auth'}
                  className="inline-block px-8 sm:px-10 lg:px-12 2xl:px-16 py-3 sm:py-4 lg:py-4 2xl:py-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-lg sm:text-xl lg:text-xl 2xl:text-3xl font-bold hover:shadow-2xl hover:shadow-purple-500/25 transition-all transform hover:scale-105"
               >
                  Get Started Now
               </Link>
               <div className="mt-4 sm:mt-6 text-xs sm:text-sm lg:text-sm 2xl:text-lg text-gray-400">
                  No fees for your first 30 days • Instant verification • Start
                  with $1000
               </div>
            </div>
         </section>

         {/* Footer */}
         <footer className="relative z-10 border-t border-gray-800 py-6 sm:py-8 lg:py-10">
            <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8">
                  <div className="md:col-span-1 lg:col-span-1">
                     <div className="text-xl lg:text-2xl 2xl:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3 lg:mb-4">
                        Suitcase
                     </div>
                     <p className="text-gray-400 text-sm lg:text-sm 2xl:text-lg">
                        The world&apos;s leading cryptocurrency exchange
                        platform.
                     </p>
                  </div>
                  <div>
                     <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base 2xl:text-xl">
                        Products
                     </h4>
                     <div className="space-y-2 text-gray-400 text-xs lg:text-sm 2xl:text-lg">
                        <div>Spot Trading</div>
                        <div>Margin Trading</div>
                        <div>Futures</div>
                        <div>Options</div>
                     </div>
                  </div>
                  <div>
                     <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base 2xl:text-xl">
                        Company
                     </h4>
                     <div className="space-y-2 text-gray-400 text-xs lg:text-sm 2xl:text-lg">
                        <div>About Us</div>
                        <div>Careers</div>
                        <div>Security</div>
                        <div>Press</div>
                     </div>
                  </div>
                  <div>
                     <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base 2xl:text-xl">
                        Support
                     </h4>
                     <div className="space-y-2 text-gray-400 text-xs lg:text-sm 2xl:text-lg">
                        <div>Help Center</div>
                        <div>Contact Us</div>
                        <div>API Docs</div>
                        <div>Status</div>
                     </div>
                  </div>
               </div>
               <div className="w-full pt-4 lg:pt-6 mt-4 lg:mt-6 flex flex-col md:flex-row justify-between items-center text-gray-400 border-t border-gray-800">
                  <p className="text-xs lg:text-xs 2xl:text-base mb-3 md:mb-0">
                     © {new Date().getFullYear()} SNACKIT. All rights reserved.
                  </p>
                  <p className="text-xs lg:text-xs 2xl:text-base">
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
