import {
   CandlestickSeries,
   ColorType,
   createChart as createLightWeightChart,
   CrosshairMode,
   ISeriesApi,
   UTCTimestamp
} from 'lightweight-charts';

export class ChartManager {
   private readonly candleSeries: ISeriesApi<'Candlestick'>;
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
               color: '#14151b' // Dark background like Backpack
            },
            textColor: '#9DA3B3', // Softer text color
            fontSize: 12
         },
         grid: {
            vertLines: {
               color: '#1C1F26', // Subtle grid lines
               style: 1
            },
            horzLines: {
               color: '#1C1F26',
               style: 1
            }
         },
         crosshair: {
            mode: CrosshairMode.Normal,
            vertLine: {
               color: '#2962FF',
               width: 1,
               style: 3,
               labelBackgroundColor: '#2962FF'
            },
            horzLine: {
               color: '#2962FF',
               width: 1,
               style: 3,
               labelBackgroundColor: '#2962FF'
            }
         },
         rightPriceScale: {
            borderColor: '#1C1F26',
            textColor: '#9DA3B3',
            scaleMargins: {
               top: 0.1,
               bottom: 0.1
            }
         },
         timeScale: {
            borderColor: '#1C1F26',
            timeVisible: true,
            secondsVisible: false,
            tickMarkFormatter: (time: number) => {
               const date = new Date(time * 1000);
               return date.toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric'
               });
            }
         }
      });
      this.chart = chart;
      this.candleSeries = chart.addSeries(CandlestickSeries);

      this.candleSeries.setData(
         initialData.map((data) => ({
            ...data,
            time: (data.timestamp / 1000) as UTCTimestamp
         }))
      );
   }
   public update(updatedPrice: any) {
      if (!this.lastUpdateTime) {
         this.lastUpdateTime = new Date().getTime();
      }

      this.candleSeries.update({
         time: (this.lastUpdateTime / 1000) as UTCTimestamp,
         close: updatedPrice.close,
         low: updatedPrice.low,
         high: updatedPrice.high,
         open: updatedPrice.open
      });

      if (updatedPrice.newCandleInitiated) {
         this.lastUpdateTime = updatedPrice.time;
      }
   }
   public destroy() {
      this.chart.remove();
   }
}
