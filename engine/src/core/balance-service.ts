import { QUOTE_ASSET } from '../utils/constants';
import { Fill, On_Ramp, UserBalance } from '../utils/types';
import { MarketDataService } from './market-data-service';

export class BalanceService {
   private balances = new Map<string, UserBalance>();

   constructor(public readonly marketDataService: MarketDataService) {}

   lockFunds(
      market: string,
      userId: string,
      side: 'buy' | 'sell',
      price: number,
      quantity: number
   ) {
      const BaseAsset = market.split('_')[0];
      const userBalance = this.getUserBalance(userId);
      const asset = side === 'buy' ? QUOTE_ASSET : BaseAsset;

      if (side === 'buy') {
         const totalAmount = price * quantity;
         if (userBalance[asset].available < totalAmount) {
            throw new Error('INSUFFICIENT_FUNDS');
         }

         userBalance[asset].available -= totalAmount;
         userBalance[asset].locked += totalAmount;
      } else {
         if (userBalance[asset].available < quantity) {
            throw new Error('INSUFFICIENT_FUNDS');
         }
         userBalance[asset].available -= quantity * 100;
         userBalance[asset].locked += quantity * 100;
      }
   }

   unlockFunds(userId: string, asset: string, amount: number) {
      const userBalance = this.getUserBalance(userId);

      if (userBalance[asset].locked < amount) {
         throw new Error('INSUFFICIENT_LOCKED_FUNDS');
      }

      userBalance[asset].locked -= amount;
      userBalance[asset].available += amount;

      console.log(`Unlocked ${amount} ${asset} for user ${userId}`);
   }

   updateBalanceAfterTrade(
      fills: Fill[],
      market: string,
      side: 'buy' | 'sell',
      userId: string
   ) {
      const [baseAsset, quoteAsset] = market.split('_');
      fills.forEach((fill) => {
         const buyerId = side === 'buy' ? userId : fill.otherUserId;
         const sellerId = side === 'sell' ? userId : fill.otherUserId;

         // Update quote asset (USDC)
         this.adjustBalance(buyerId, quoteAsset, -fill.price * fill.quantity);
         this.adjustBalance(sellerId, quoteAsset, fill.price * fill.quantity);

         // Update base asset (SOL)
         this.adjustBalance(sellerId, baseAsset, -fill.quantity);
         this.adjustBalance(buyerId, baseAsset, fill.quantity);
      });
   }

   getUserBalances(userId: string, clientId: string) {
      const userBalance = this.balances.get(userId);

      this.marketDataService.sendUserBalance(clientId, userBalance);
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
            '123',
            {
               [QUOTE_ASSET]: { available: 100_0000, locked: 0 },
               SOL: { available: 50, locked: 0 } // 50 SOL
            }
         ],
         [
            '231',
            {
               [QUOTE_ASSET]: { available: 50_0000, locked: 0 },
               SOL: { available: 25, locked: 0 }
            }
         ]
      ]);
   }

   onRamp(data: On_Ramp['data'], clientId: string) {
      const { userId, quantity, asset } = data;
      // Get or create user balance
      const userBalance = this.balances.get(userId) || {
         [QUOTE_ASSET]: { available: 0, locked: 0 }
      };
      // Initialize asset if not exists
      if (!userBalance[asset]) {
         userBalance[asset] = { available: 0, locked: 0 };
      }

      userBalance[asset].available += quantity;
      this.balances.set(userId, userBalance);
      this.marketDataService.sendOnRampSuccess(clientId, data);

      console.log(`On-ramped ${quantity} ${asset} for user ${userId}`);
   }

   private getUserBalance(userId: string): UserBalance {
      if (!this.balances.has(userId)) throw new Error('USER_NOT_FOUND');

      return this.balances.get(userId)!;
   }

   private adjustBalance(userId: string, asset: string, delta: number) {
      const balance = this.getUserBalance(userId);
      balance[asset].available += delta;
   }
}
