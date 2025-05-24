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
   const chartManagerRef = useRef<ChartManager>(null);

   useEffect(() => {
      const init = async () => {
         if (chartRef) {
            if (chartManagerRef.current) {
               chartManagerRef.current.destroy();
            }

            const chartManager = new ChartManager(
               chartRef.current,
               (klineData ?? [])
                  .map((x) => ({
                     close: parseFloat(x.close),
                     high: parseFloat(x.high),
                     low: parseFloat(x.low),
                     open: parseFloat(x.open),
                     timestamp: new Date(x.end)
                  }))
                  .sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1))
            );
            chartManagerRef.current = chartManager;
         }
      };

      init();

      return () => {
         if (chartManagerRef.current) {
            chartManagerRef.current.destroy();
            chartManagerRef.current = null;
         }
      };
   }, [market, chartRef, klineData]);

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-full">
            <MessageLoading />
         </div>
      );
   }

   return (
      <div
         ref={chartRef}
         style={{
            display: 'block',
            height: '100%',
            width: '100%',
            minHeight: '400px'
         }}
      ></div>
   );
}
