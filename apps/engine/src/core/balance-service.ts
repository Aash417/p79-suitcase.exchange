import type { Fill, OnRamp } from '@repo/shared-types/messages/api-engine';
import { QUOTE_ASSET } from '../utils/constants';
import type { UserBalance } from '../utils/types';
import { MarketDataService } from './market-data-service';

export class BalanceService {
   private balances = new Map<string, UserBalance>();

   constructor(public marketDataService: MarketDataService) {}

   lockFunds(
      market: string,
      userId: string,
      side: 'buy' | 'sell',
      price: number,
      quantity: number
   ) {
      const BaseAsset = market.split('_')[0] as string;
      const userBalance = this.getUserBalance(userId);
      const asset = side === 'buy' ? QUOTE_ASSET : BaseAsset;

      const specificAssetBalance = userBalance[asset];
      if (!specificAssetBalance) throw new Error(`ASSET_NOT_FOUND: ${asset}`);

      if (side === 'buy') {
         const totalAmount = price * quantity;
         if (specificAssetBalance.available < totalAmount)
            throw new Error('INSUFFICIENT_FUNDS');

         specificAssetBalance.available -= totalAmount;
         specificAssetBalance.locked += totalAmount;
      } else {
         if (specificAssetBalance.available < quantity)
            throw new Error('INSUFFICIENT_FUNDS');

         specificAssetBalance.available -= quantity * 100;
         specificAssetBalance.locked += quantity * 100;
      }
   }

   unlockFunds(userId: string, asset: string, amount: number) {
      const userBalance = this.getUserBalance(userId);

      const specificAssetBalance = userBalance[asset];
      if (!specificAssetBalance) throw new Error(`ASSET_NOT_FOUND: ${asset}`);

      if (specificAssetBalance.locked < amount)
         throw new Error('INSUFFICIENT_LOCKED_FUNDS');

      specificAssetBalance.locked -= amount;
      specificAssetBalance.available += amount;
   }

   updateBalanceAfterTrade(
      fills: Fill[],
      market: string,
      side: 'buy' | 'sell',
      userId: string,
      executedQty: number = 0,
      price: number = 0,
      quantity: number = 0
   ): void {
      const [baseAsset, quoteAsset] = market.split('_') as [string, string];

      // check if user has base asset if not, initialize it first before buying
      const userBalance = this.getUserBalance(userId);
      userBalance[baseAsset] ??= { available: 0, locked: 0 };

      fills.forEach((fill) => {
         const buyerId = side === 'buy' ? userId : fill.otherUserId;
         const sellerId = side === 'sell' ? userId : fill.otherUserId;

         // Update locked asset
         this.adjustLockedBalance(
            buyerId,
            quoteAsset,
            fill.price * fill.quantity
         );
         this.adjustLockedBalance(sellerId, baseAsset, fill.quantity * 100);

         // Update available asset
         this.adjustAvailableBalance(buyerId, baseAsset, fill.quantity * 100);
         this.adjustAvailableBalance(
            sellerId,
            quoteAsset,
            fill.price * fill.quantity
         );
      });

      if (side === 'buy' && executedQty === quantity) {
         // Calculate the total actual cost of the executed portion
         const totalActualCost = fills.reduce(
            (sum, f) => sum + f.price * f.quantity,
            0
         );
         const costAtLimitPriceForExecutedPortion = price * executedQty;

         // The difference is the savings due to price improvement
         const savingsOnExecutedPortion =
            costAtLimitPriceForExecutedPortion - totalActualCost;

         // Unlock these savings from the user's locked quote asset balance and add them to their available balance.
         if (savingsOnExecutedPortion > 0)
            this.unlockFunds(userId, quoteAsset, savingsOnExecutedPortion);
      }
   }

   getUserBalances(userId: string, clientId: string): void {
      const userBalance = this.getUserBalance(userId);
      this.marketDataService.sendUserBalance(clientId, userBalance);
   }

   getBalances(): Map<string, UserBalance> {
      return new Map(this.balances);
   }

   setBalances(balances: Map<string, UserBalance>) {
      this.balances = new Map(balances);
   }

   setDefaultBalances(): void {
      this.balances = new Map([
         [
            '123',
            {
               [QUOTE_ASSET]: { available: 10000, locked: 0 },
               SOL: { available: 5000, locked: 0 }
            }
         ],
         [
            '231',
            {
               [QUOTE_ASSET]: { available: 5000, locked: 0 },
               SOL: { available: 2500, locked: 0 }
            }
         ]
      ]);
   }

   onRamp(data: OnRamp['data'], clientId: string): void {
      const { userId, quantity, asset } = data;
      // Get or create user balance
      const userBalance = this.getUserBalance(userId);
      userBalance[asset] ??= { available: 0, locked: 0 };

      userBalance[asset].available += quantity;

      this.balances.set(userId, userBalance);
      this.marketDataService.sendOnRampSuccess(clientId, data);
   }

   addNewUser(userId: string, clientId: string): void {
      if (this.balances.has(userId)) {
         this.marketDataService.sendUserAlreadyExists(clientId, userId);
         return;
      }
      // Initialize user balance with default values
      const initialBalance: UserBalance = {
         [QUOTE_ASSET]: { available: 100000, locked: 0 }
      };

      this.balances.set(userId, initialBalance);
      this.marketDataService.sendAddNewUserSuccess(clientId, userId);
   }

   private getUserBalance(userId: string): UserBalance {
      if (!this.balances.has(userId)) throw new Error('USER_NOT_FOUND');
      const userBalance = this.balances.get(userId);
      if (!userBalance) throw new Error('USER_BALANCE_NOT_FOUND');

      return userBalance;
   }

   private adjustLockedBalance(
      userId: string,
      asset: string,
      delta: number
   ): void {
      const userBalance = this.getUserBalance(userId);
      if (!userBalance[asset]) throw new Error(`ASSET_NOT_FOUND: ${asset}`);

      userBalance[asset].locked -= delta;
   }

   private adjustAvailableBalance(
      userId: string,
      asset: string,
      delta: number
   ): void {
      const userBalance = this.getUserBalance(userId);
      if (!userBalance[asset]) throw new Error(`ASSET_NOT_FOUND: ${asset}`);

      userBalance[asset].available += delta;
   }
}
