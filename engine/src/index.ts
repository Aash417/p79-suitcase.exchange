import { createClient } from 'redis';
import { Engine } from './core/engine';

async function main() {
   const engine = new Engine();
   const redisClient = createClient();

   await redisClient.connect();

   console.log('connected to redis');
   console.log('engine running');

   while (true) {
      const response = await redisClient.rPop('messages' as string);
      if (response) {
         engine.process(JSON.parse(response));
      }
   }
}

main();
