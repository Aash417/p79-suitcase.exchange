import { QUOTE_ASSET } from '../utils/constants';
import { Fill, UserBalance } from '../utils/types';

export class BalanceService {
   private balances = new Map<string, UserBalance>();

   lockFunds(
      userId: string,
      side: 'buy' | 'sell',
      price: number,
      quantity: number,
   ) {
      const balance = this.getUserBalance(userId);
      const asset = side === 'buy' ? QUOTE_ASSET : 'SOL';

      const totalAmount = price * quantity;
      if (balance[asset].available < totalAmount) {
         throw new Error('Insufficient funds');
      }

      balance[asset].available -= totalAmount;
      balance[asset].locked += totalAmount;
   }

   unlockFunds(userId: string, asset: string, amount: number) {
      try {
         const userBalance = this.getUserBalance(userId);

         if (userBalance[asset].locked < amount) {
            throw new Error(`Insufficient locked ${asset} to unlock`);
         }

         userBalance[asset].locked -= amount;
         userBalance[asset].available += amount;

         console.log(`Unlocked ${amount} ${asset} for user ${userId}`);
      } catch (error) {
         console.error(`Failed to unlock funds: ${error.message}`);
         throw error;
      }
   }

   updateBalanceAfterTrade(
      fills: Fill[],
      market: string,
      side: 'buy' | 'sell',
      userId: string,
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

   getBalances(): Map<string, UserBalance> {
      return new Map(this.balances);
   }

   setBalances(balances: Map<string, UserBalance>) {
      this.balances = new Map(balances);
   }

   setDefaultBalances() {
      this.balances = new Map([
         [
            'user1',
            {
               [QUOTE_ASSET]: { available: 100_0000, locked: 0 },
               SOL: { available: 50, locked: 0 }, // 50 SOL
            },
         ],
         [
            'user2',
            {
               [QUOTE_ASSET]: { available: 50_0000, locked: 0 },
               SOL: { available: 25, locked: 0 },
            },
         ],
      ]);
   }

   onRamp(userId: string, amount: string) {}

   private getUserBalance(userId: string): UserBalance {
      if (!this.balances.has(userId)) {
         throw new Error(`User ${userId} not found`);
      }
      return this.balances.get(userId)!;
   }

   private adjustBalance(userId: string, asset: string, delta: number) {
      const balance = this.getUserBalance(userId);
      balance[asset].available += delta;
   }
}
