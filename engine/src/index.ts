import { createClient } from 'redis';
import { Engine } from './core/engine';

async function main() {
   const engine = new Engine();
   console.log('engine running');

   const redisClient = createClient();
   await redisClient.connect();
   console.log('connected to redis');

   while (true) {
      const response = await redisClient.rPop('messages' as string);
      if (response) {
         engine.process(JSON.parse(response));
      }
   }
}

main();
