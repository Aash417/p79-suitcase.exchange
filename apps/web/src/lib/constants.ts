export const SYMBOLS = [
   {
      name: 'Bitcoin',
      symbol: 'BTC_USDC',
      imageUrl: '/btc.webp'
   },
   {
      name: 'Ethereum',
      symbol: 'ETH_USDC',
      imageUrl: '/eth.webp'
   },
   {
      name: 'USDT',
      symbol: 'USDT_USDC',
      imageUrl: '/usdt.webp'
   },
   {
      name: 'Solana',
      symbol: 'SOL_USDC',
      imageUrl: '/sol.webp'
   },
   {
      name: 'Chainlink',
      symbol: 'LINK_USDC',
      imageUrl: '/link.svg'
   },
   {
      name: 'Shiba Inu',
      symbol: 'SHIB_USDC',
      imageUrl: '/shib.svg'
   },
   {
      name: 'Pepe',
      symbol: 'PEPE_USDC',
      imageUrl: '/pepe.svg'
   },
   {
      name: 'Uniswap',
      symbol: 'UNI_USDC',
      imageUrl: '/uni.webp'
   },
   {
      name: 'Ondo',
      symbol: 'ONDO_USDC',
      imageUrl: '/ondo.svg'
   },
   {
      name: 'Official Trump',
      symbol: 'TRUMP_USDC',
      imageUrl: '/trump.webp'
   }
];

export const SYMBOLS_MAP = new Map(SYMBOLS.map((item) => [item.symbol, item]));

export type SymbolInfo = {
   name: string;
   symbol: string;
   imageUrl: string;
};
