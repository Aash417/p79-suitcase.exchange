export default function Loading() {
   return (
      // Skeleton loading screen for markets page
      <div className="flex flex-col w-full h-screen p-4 rounded-xl md:py-2 md:px-4 2xl:px-6 animate-pulse">
         {/* Top section: Tab skeleton */}
         <div className="h-[8%] lg:h-[10%] bg-base-background-l1 rounded-t-xl">
            <div className="flex flex-row items-center h-full px-4 2xl:px-6">
               <div className="flex flex-row items-center justify-center gap-2">
                  <div className="w-20 h-8 rounded-lg 2xl:h-10 2xl:w-24 bg-base-background-l2"></div>
                  <div className="w-20 h-8 rounded-lg 2xl:h-10 2xl:w-24 bg-base-border-med"></div>
                  <div className="w-20 h-8 rounded-lg 2xl:h-10 2xl:w-24 bg-base-border-med"></div>
               </div>
            </div>
         </div>

         {/* Middle section: Table skeleton */}
         <div className="px-4 pb-4 overflow-auto bg-base-background-l1 rounded-b-xl 2xl:px-6">
            {/* Table header skeleton */}
            <div className="flex py-4">
               <div className="w-1/4 h-4 rounded 2xl:h-5 bg-base-border-med"></div>
               <div className="w-1/6 h-4 rounded 2xl:h-5 bg-base-border-med"></div>
               <div className="hidden w-1/6 h-4 rounded 2xl:h-5 bg-base-border-med sm:block"></div>
               <div className="w-1/6 h-4 rounded 2xl:h-5 bg-base-border-med"></div>
               <div className="hidden w-1/6 h-4 rounded 2xl:h-5 bg-base-border-med lg:block"></div>
            </div>{' '}
            {/* Table rows skeleton */}
            <div className="divide-y divide-[#1C1F26]">
               {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                     key={idx + 1}
                     className="flex items-center justify-between py-4"
                  >
                     <div className="flex items-center w-2/5 md:w-1/4">
                        <div className="mr-3 rounded-full size-6 sm:size-8 2xl:size-10 bg-base-background-l2"></div>
                        <div className="flex flex-col space-y-2">
                           <div className="w-20 h-4 rounded sm:h-5 2xl:h-6 bg-base-background-l2"></div>
                        </div>
                     </div>
                     <div className="flex items-center justify-end w-3/5 space-x-4 md:space-x-6 md:w-3/4">
                        {' '}
                        <div className="w-12 h-6 rounded md:w-1/6 2xl:h-8 bg-base-background-l2"></div>
                        <div className="hidden w-1/6 h-6 rounded 2xl:h-8 bg-base-background-l2 sm:block"></div>
                        <div className="w-12 h-6 rounded md:w-1/6 2xl:h-8 bg-base-background-l2"></div>
                        <div className="hidden w-1/6 h-6 rounded 2xl:h-8 bg-base-background-l2 lg:block"></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
