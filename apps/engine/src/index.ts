import { Engine } from './core/engine';
import { ErrorService } from './core/error-service';
import { RedisService } from './core/redis-service';

const errorService = new ErrorService();

async function main() {
   const engine = new Engine();
   const redisService = RedisService.getInstance();

   try {
      // Ensure Redis connection is established
      await redisService.ensureConnection();
      console.log('Engine running');

      // Process messages from the queue
      for await (const message of redisService.processQueue('messages')) {
         try {
            const parsedMessage = JSON.parse(message);
            engine.process(parsedMessage);
         } catch (parseError) {
            console.error('Error parsing message:', parseError);
         }
      }
   } catch (error) {
      console.error('Fatal error in main processing loop:', error);
   }
}

main().catch(async (error) => {
   console.error('Unhandled error in main function:', error);
   errorService.logError(error);
   await RedisService.getInstance().shutdown();
   process.exit(1);
});
