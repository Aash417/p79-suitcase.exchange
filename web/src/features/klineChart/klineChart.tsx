'use client';

import { ChartManager } from '@/features/klineChart/utils/chartManager';
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
                     timestamp: new Date(x.end),
                  }))
                  .sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)),
               {
                  background: '#0e0f14',
                  color: 'white',
               },
            );
            chartManagerRef.current = chartManager;
         }
      };
      init();
   }, [market, chartRef, klineData]);

   return (
      <div
         ref={chartRef}
         style={{ height: '80%', width: '90%' }}
         className="m-5 p-0 relative h-full w-full"
      ></div>
   );
}
