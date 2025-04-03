import { Hono } from 'hono';
import depthRouter from './routes/depth';
import klineRouter from './routes/kline';
import orderRouter from './routes/order';
import tickerRouter from './routes/ticker';

const app = new Hono();

app.route('/api/v1/depth', depthRouter);
app.route('/api/v1/kline', klineRouter);
app.route('/api/v1/order', orderRouter);
app.route('/api/v1/ticker', tickerRouter);

app.get('/', (c) => {
   return c.text('Hello Hono!');
});

export default {
   port: 3001,
   fetch: app.fetch,
};
