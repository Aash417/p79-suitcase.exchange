// engineInspector.ts

import { Orderbook } from "../core/orderbook";
import { UserBalance } from "./types";

export function printUserBalance(
   balances: Map<string, UserBalance>,
   userId: string
) {
   const bal = balances.get(userId);
   console.log(`\n📘 Balance for ${userId}:`);
   if (!bal) return console.log('Not found');

   for (const [symbol, { available, locked }] of Object.entries(bal)) {
      console.log(`- ${symbol}: available = ${available}, locked = ${locked}`);
   }
}

export function printAllUserBalances(balances: Map<string, UserBalance>) {
   console.log('\n📒 All User Balances:');
   for (const [userId, bal] of balances.entries()) {
      console.log(`\n🧑 User: ${userId}`);
      for (const [symbol, { available, locked }] of Object.entries(bal)) {
         console.log(
            `- ${symbol}: available = ${available}, locked = ${locked}`
         );
      }
   }
}

export function printAllOrderbooks(orderbooks: Map<string, Orderbook>) {
   console.log('\n📈 Orderbook Summary:');
   for (const [pair, ob] of orderbooks.entries()) {
      console.log(ob.summary());
   }
}

// Optional helper to call all in one go
export function printEngineState(
   balances: Map<string, UserBalance>,
   orderbooks: Map<string, Orderbook>
) {
   printAllUserBalances(balances);
   printAllOrderbooks(orderbooks);
}
