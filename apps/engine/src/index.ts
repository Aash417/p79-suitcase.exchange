import { createClient } from 'redis';
import { Engine } from './core/engine';

async function main() {
   const engine = new Engine();
   const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
   console.log(`Connecting to Redis at ${redisUrl}`);
   const redisClient = createClient({ url: redisUrl });
   await redisClient.connect();

   console.log('engine running');

   while (true) {
      const response = await redisClient.rPop('messages' as string);
      if (response) {
         engine.process(JSON.parse(response));
      }
   }
}

main();
