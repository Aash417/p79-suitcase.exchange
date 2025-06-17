import { Hono, type Context, type Next } from 'hono';
import { cors } from 'hono/cors';
import capitalRouter from './routes/capital';
import depthRouter from './routes/depth';
import klineRouter from './routes/kline';
import orderRouter from './routes/order';
import tickerRouter from './routes/ticker';
import tickersRouter from './routes/tickers';
import tradesRouter from './routes/trades';
import userRouter from './routes/user';
import { startDataCollection } from './utils/collect-data';

const app = new Hono();

let requestCount = 0;
async function requestCounter(c: Context, next: Next) {
   requestCount++;
   await next();
}
const allowedOrigins = [
   'https://suitcase.exchange.aashishk.works',
   'https://suitcase-exchange.vercel.app',
   'http://localhost:3000'
];

app.use('*', requestCounter);
app.use(
   cors({
      origin: allowedOrigins,
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'Accept']
   })
);

app.route('/api/v1/depth', depthRouter);
app.route('/api/v1/klines', klineRouter);
app.route('/api/v1/order', orderRouter);
app.route('/api/v1/ticker', tickerRouter);
app.route('/api/v1/tickers', tickersRouter);
app.route('/api/v1/capital', capitalRouter);
app.route('/api/v1/trades', tradesRouter);
app.route('/api/v1/user', userRouter);

app.get('/', (c) => {
   return c.text('Hello Hono!');
});

app.get('/metrics', (c) => {
   return c.text(`Total Requests: ${requestCount}`);
});

startDataCollection(); // Start periodic data collection at server startup

export default {
   port: 3001,
   fetch: app.fetch
};
