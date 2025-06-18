'use client';

import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function MaintenanceModal() {
   const [isOpen, setIsOpen] = useState(false);
   const [shouldShowModal, setShouldShowModal] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

   // Check maintenance status on component mount
   useEffect(() => {
      const checkMaintenanceStatus = async () => {
         try {
            const response = await fetch('/api/check-maintenance');
            const data = await response.json();
            console.log(data);

            // If there's data in the test table (length > 0), show the modal
            setShouldShowModal(data.records?.length > 0);
         } catch (error) {
            console.error('Failed to fetch maintenance status:', error);
            setShouldShowModal(false); // Default to not showing on error
         } finally {
            setIsLoading(false);
         }
      };

      checkMaintenanceStatus();
   }, []);

   useEffect(() => {
      // Open the modal immediately when shouldShowModal becomes true
      if (shouldShowModal && !isLoading) {
         setIsOpen(true);
      }
   }, [shouldShowModal, isLoading]);

   useEffect(() => {
      if (isOpen) {
         document.body.classList.add('overflow-hidden');
      } else {
         document.body.classList.remove('overflow-hidden');
      }

      return () => {
         document.body.classList.remove('overflow-hidden');
      };
   }, [isOpen]);

   if (isLoading || !shouldShowModal || !isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         <button
            aria-label="Close modal"
            className="absolute inset-0 w-full h-full bg-black/50 backdrop-blur-sm cursor-default"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
               if (e.key === 'Escape') setIsOpen(false);
            }}
         />

         {/* Modal Content - Backpack-inspired design */}
         <div className="relative z-10 w-full max-w-md rounded-xl bg-[#14151b] border border-zinc-700/50 shadow-2xl overflow-hidden">
            {/* Header accent line */}
            <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-amber-600" />

            <div className="p-6 sm:p-8 space-y-5">
               {/* Icon and title */}
               <div className="flex flex-col items-center gap-3 pb-2">
                  <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center">
                     <AlertTriangle className="h-8 w-8 text-amber-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white text-center">
                     Services Currently Unavailable
                  </h2>
               </div>

               {/* Message */}
               <div className="space-y-3 text-left">
                  <p className="text-zinc-200">
                     All trading services are currently offline as running the
                     servers requires actual money.
                  </p>

                  <p className="text-zinc-400 text-sm">
                     This was a demo project which mimics actual trading
                     platform. No real trades or transactions are processed.
                  </p>
               </div>

               {/* Button */}
               <div className="pt-3 flex justify-center">
                  <button
                     onClick={() => setIsOpen(false)}
                     className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                     I Understand
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
