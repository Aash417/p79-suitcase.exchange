// Parses string input like "8990" and ensures it's a valid integer
export function parseInputAmount(value: string): number {
   const num = Number(value);
   if (!/^\d+$/.test(value) || isNaN(num)) {
      throw new Error(`Invalid input amount: ${value}`);
   }
   return num;
}

// Converts number back to string for API responses or logging
export function formatOutputAmount(value: number): string {
   return value.toString();
}

// Optional: converts float rupee to integer paise (e.g., 89.90 → 8990)
export function toSmallestUnit(amount: string | number, decimals = 2): number {
   return Math.round(Number(amount) * Math.pow(10, decimals));
}

// Optional: converts integer paise to rupees string (e.g., 8990 → "89.90")
export function fromSmallestUnit(value: number, decimals = 2): string {
   return (value / Math.pow(10, decimals)).toFixed(decimals);
}
