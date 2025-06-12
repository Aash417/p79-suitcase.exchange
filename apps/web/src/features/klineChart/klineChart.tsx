'use client';

import { MessageLoading } from '@/components/ui/message-loading';
import { ChartManager } from '@/features/klineChart/utils/chart-manager';
import { useGetKline } from '@/hooks';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function KlineChart() {
   const market = useParams<{ market: string }>().market || '';
   const { data: klineData, isLoading } = useGetKline(market);

   const chartRef = useRef<HTMLDivElement>(null);
   const chartManagerRef = useRef<ChartManager | null>(null); // Initialize with null

   useEffect(() => {
      function init() {
         // Only proceed if the chartRef is attached to a DOM element
         // and klineData is available and is an array.
         if (chartRef.current && klineData && Array.isArray(klineData)) {
            // If a chart instance already exists, destroy it first.
            if (chartManagerRef.current) {
               chartManagerRef.current.destroy();
               chartManagerRef.current = null; // Clear the ref
            }

            const formattedData = klineData
               .map((x) => ({
                  close: parseFloat(x.close),
                  high: parseFloat(x.high),
                  low: parseFloat(x.low),
                  open: parseFloat(x.open),
                  timestamp: new Date(x.end) // ChartManager expects this format
               }))
               .sort((x, y) => x.timestamp.getTime() - y.timestamp.getTime()); // Sort by timestamp

            // Create new chart instance
            const chartManager = new ChartManager(
               chartRef.current, // This is now guaranteed to be a DOM element
               formattedData
            );
            chartManagerRef.current = chartManager;
         }
      }

      init();

      // Cleanup function: This is called when the component unmounts
      // or before the effect runs again (if dependencies change).
      return () => {
         if (chartManagerRef.current) {
            chartManagerRef.current.destroy();
            chartManagerRef.current = null;
         }
      };
      // Dependencies: The effect should re-run if the market or its data changes.
      // chartRef itself (the ref object) is stable and doesn't need to be a dependency
      // for the logic of accessing its .current property.
   }, [market, klineData]);

   // Show loading state if data is loading or not yet available/valid
   if (isLoading || !klineData || !Array.isArray(klineData)) {
      return (
         <div className="flex items-center justify-center h-full">
            <MessageLoading />
         </div>
      );
   }

   // Render the div that will host the chart
   return (
      <div
         ref={chartRef}
         className="p-3 min-w-0"
         style={{
            display: 'block',
            height: '100%',
            width: '100%',
            minHeight: '400px',
            overflowX: 'auto' // allow horizontal scroll if chart overflows
         }}
      ></div>
   );
}
