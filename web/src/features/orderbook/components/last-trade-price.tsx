type Props = {
   lastTradePrice?: string;
};

export default function LastTradePrice({ lastTradePrice }: Readonly<Props>) {
   return (
      <div className="flex flex-col bg-base-background-l1 z-10 flex-0 snap-center px-3 py-1 sticky bottom-0">
         <div className="flex justify-between flex-row">
            <div className="flex items-center flex-row gap-1.5">
               <p className="font-medium tabular-nums text-green-text">
                  {lastTradePrice}
               </p>
            </div>
         </div>
      </div>
   );
}
