import { RedisClientType, createClient } from 'redis';
import { MessageFromOrderbook, MessageToEngine } from './types';

export class RedisManager {
   private readonly client: RedisClientType;
   private readonly publisher: RedisClientType;
   private static instance: RedisManager;

   private constructor() {
      this.client = createClient();
      this.client.connect();

      this.publisher = createClient();
      this.publisher.connect();
   }

   public static getInstance() {
      if (!this.instance) {
         this.instance = new RedisManager();
      }
      return this.instance;
   }

   public sendAndAwait(message: MessageToEngine, timeoutMs: number = 5000) {
      return new Promise<MessageFromOrderbook>((resolve, reject) => {
         const id = this.getRandomClientId();
         let timeout: NodeJS.Timeout;

         // Set up the timeout
         timeout = setTimeout(() => {
            this.client.unsubscribe(id); // Ensure we unsubscribe to avoid resource leaks
            reject(
               new Error(`Timeout: No response received within ${timeoutMs}ms`),
            );
         }, timeoutMs);

         // Subscribe to the Redis channel
         this.client.subscribe(id, (message) => {
            clearTimeout(timeout); // Clear the timeout if a response is received
            this.client.unsubscribe(id);
            resolve(JSON.parse(message));
         });

         // Publish the message to the Redis queue
         this.publisher.lPush(
            'messages',
            JSON.stringify({ clientId: id, message }),
         );
      });
   }

   public getRandomClientId() {
      return (
         Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15)
      );
   }
}
