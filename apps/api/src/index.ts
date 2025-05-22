import { Hono } from 'hono';
import { cors } from 'hono/cors';
import capitalRouter from './routes/capital';
import depthRouter from './routes/depth';
import klineRouter from './routes/kline';
import orderRouter from './routes/order';
import tickerRouter from './routes/ticker';
import tickersRouter from './routes/tickers';
import tradesRouter from './routes/trades';

const app = new Hono();

app.use(
   cors({
      origin: '*', // Allow all origins (for development only!)
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

app.get('/', (c) => {
   return c.text('Hello Hono!');
});

export default {
   port: 3001,
   fetch: app.fetch
};
