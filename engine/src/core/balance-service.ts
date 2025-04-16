import { BASE_CURRENCY, Fill, UserBalance } from '../utils/types';

export class BalanceService {
   private balances = new Map<string, UserBalance>();

   lockFunds(
      userId: string,
      side: 'buy' | 'sell',
      price: number,
      quantity: number
   ) {
      const balance = this.getUserBalance(userId);
      const asset = side === 'buy' ? BASE_CURRENCY : 'SOL'; // Adjust per market

      const totalPaisa = price * quantity;
      if (balance[asset].available < totalPaisa) {
         throw new Error('Insufficient funds');
      }

      balance[asset].available -= totalPaisa;
      balance[asset].locked += totalPaisa;
   }

   updateAfterTrade(
      fills: Fill[],
      market: string,
      side: 'buy' | 'sell',
      userId: string
   ) {
      const [baseAsset, quoteAsset] = market.split('_');
      fills.forEach((fill) => {
         const buyerId = side === 'buy' ? userId : fill.otherUserId;
         const sellerId = side === 'sell' ? userId : fill.otherUserId;

         // Update quote asset (INR)
         this.adjustBalance(buyerId, quoteAsset, -fill.price * fill.qty);
         this.adjustBalance(sellerId, quoteAsset, fill.price * fill.qty);

         // Update base asset (SOL)
         this.adjustBalance(sellerId, baseAsset, -fill.qty);
         this.adjustBalance(buyerId, baseAsset, fill.qty);
      });
   }

   setBalances(balances: Map<string, UserBalance>) {
      this.balances = new Map(balances);
   }

   setDefaultBalances() {
      this.balances = new Map([
         [
            'user1',
            {
               [BASE_CURRENCY]: { available: 100_0000, locked: 0 }, // 10,000.00 INR
               SOL: { available: 50, locked: 0 }, // 50 SOL
            },
         ],
         [
            'user2',
            {
               [BASE_CURRENCY]: { available: 50_0000, locked: 0 }, // 5,000.00 INR
               SOL: { available: 25, locked: 0 },
            },
         ],
      ]);
   }

   onRamp(userId: string, amount: string) {}

   private getUserBalance(userId: string): UserBalance {
      if (!this.balances.has(userId)) {
         this.balances.set(userId, {
            [BASE_CURRENCY]: { available: 0, locked: 0 },
            SOL: { available: 0, locked: 0 },
         });
      }
      return this.balances.get(userId)!;
   }

   private adjustBalance(userId: string, asset: string, delta: number) {
      const balance = this.getUserBalance(userId);
      balance[asset].available += delta;
   }
}
