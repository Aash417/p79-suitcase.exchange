export function TableHeader() {
   return (
      <div className="flex flex-row min-w-0 gap-1 px-3 py-2">
         <div className="flex justify-between flex-row w-2/3 min-w-0 gap-1">
            <p className="font-medium text-high-emphasis truncate text-xs">
               Price (USDC)
            </p>
            <p className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer text-med-emphasis h-auto truncate text-right text-xs">
               Size (SOL)
            </p>
         </div>
         <p className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer text-med-emphasis h-auto w-1/3 truncate text-right text-xs">
            Total (SOL)
         </p>
      </div>
   );
}
