/* eslint-disable @typescript-eslint/no-explicit-any */
import {
   AreaSeries,
   ColorType,
   createChart as createLightWeightChart,
   CrosshairMode,
   ISeriesApi,
   UTCTimestamp
} from 'lightweight-charts';

export class ChartManager {
   private readonly candleSeries: ISeriesApi<'Area'>;
   private lastUpdateTime: number = 0;
   private readonly chart: any;
   private readonly currentBar: {
      open: number | null;
      high: number | null;
      low: number | null;
      close: number | null;
   } = {
      open: null,
      high: null,
      low: null,
      close: null
   };

   constructor(ref: any, initialData: any[]) {
      const chart = createLightWeightChart(ref, {
         autoSize: true,
         layout: {
            background: {
               type: ColorType.Solid,
               color: '#14151b'
            },
            textColor: '#9DA3B3',
            fontSize: 12,
            fontFamily: 'Inter, Arial, sans-serif'
         },
         grid: {
            vertLines: {
               color: '#23242a',
               style: 1,
               visible: true
            },
            horzLines: {
               color: '#23242a',
               style: 1,
               visible: true
            }
         },
         crosshair: {
            mode: CrosshairMode.Normal,
            vertLine: {
               color: '#2962FF',
               width: 1,
               style: 3,
               labelBackgroundColor: '#2962FF',
               visible: true
            },
            horzLine: {
               color: '#2962FF',
               width: 1,
               style: 3,
               labelBackgroundColor: '#2962FF',
               visible: true
            }
         },
         rightPriceScale: {
            borderColor: '#1C1F26',
            textColor: '#9DA3B3',
            scaleMargins: {
               top: 0.1,
               bottom: 0.1
            },
            autoScale: true,
            alignLabels: true
         },
         timeScale: {
            borderColor: '#1C1F26',
            timeVisible: true,
            secondsVisible: false,
            fixLeftEdge: true,
            fixRightEdge: true,
            lockVisibleTimeRangeOnResize: true,
            tickMarkFormatter: (time: number) => {
               const date = new Date(time * 1000);
               return date.toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric'
               });
            }
         },
         handleScroll: true,
         handleScale: true,
         localization: {
            dateFormat: 'yyyy-MM-dd'
         }
      });
      this.chart = chart;
      // Use AreaSeries for the chart and set color using applyOptions
      this.candleSeries = chart.addSeries(AreaSeries);
      this.candleSeries.applyOptions({
         topColor: 'rgba(59,130,246,0.4)', // blue-500 with opacity
         bottomColor: 'rgba(59,130,246,0.05)', // lighter blue
         lineColor: '#3b82f6', // blue-500
         lineWidth: 2,
         crosshairMarkerVisible: true,
         lastValueVisible: true,
         priceLineVisible: true
      });

      // Set area chart data (use close price for area chart)
      this.candleSeries.setData(
         initialData.map((data) => ({
            time: (data.timestamp / 1000) as UTCTimestamp,
            value: data.close
         }))
      );

      // Add a watermark and enable scroll/zoom
      chart.applyOptions({
         handleScroll: true,
         handleScale: true
      });
   }
   public update(updatedPrice: any) {
      if (!this.lastUpdateTime) {
         this.lastUpdateTime = new Date().getTime();
      }
      // Update line chart with close price only
      this.candleSeries.update({
         time: (this.lastUpdateTime / 1000) as UTCTimestamp,
         value: updatedPrice.close
      });
      if (updatedPrice.newCandleInitiated) {
         this.lastUpdateTime = updatedPrice.time;
      }
   }
   public destroy() {
      this.chart.remove();
   }
}
