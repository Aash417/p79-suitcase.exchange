'use client';

import { ChartManager } from '@/features/klineChart/utils/chart-manager';
import { useEffect, useRef } from 'react';
import { KLine } from './utils/types';

type Props = {
   market: string;
   klineData: KLine[];
};

export default function KlineChart({ market, klineData }: Readonly<Props>) {
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
               klineData
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

   return (
      <div
         ref={chartRef}
         style={{
            display: 'block',
            height: '100%', // Full height
            width: '100%', // Full width
            minHeight: '400px' // Minimum height for better visibility}}
         }}
      ></div>
   );
}
