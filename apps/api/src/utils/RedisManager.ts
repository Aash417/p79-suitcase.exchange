import type {
   ApiToEngineMessage,
   EngineToApiMessage
} from '@repo/shared-types/messages/api-engine';
import { randomUUID } from 'crypto';
import { type RedisClientType, createClient } from 'redis';

export class RedisManager {
   private readonly client: RedisClientType;
   private readonly publisher: RedisClientType;
   private static instance: RedisManager;
   private isConnected = false;
   private connectionAttempts = 0;
   private readonly baseReconnectDelay = 1000;

   private constructor() {
      const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
      console.log(`RedisManager connecting to ${redisUrl}`);

      this.client = createClient({ url: redisUrl });
      this.publisher = createClient({ url: redisUrl });

      this.setupEventHandlers();
      this.initialize();
   }

   static getInstance(): RedisManager {
      if (!this.instance) {
         this.instance = new RedisManager();
      }
      return this.instance;
   }

   async sendAndAwait(
      message: ApiToEngineMessage,
      timeoutMs: number = 5000
   ): Promise<EngineToApiMessage> {
      await this.ensureConnection();

      return new Promise<EngineToApiMessage>((resolve, reject) => {
         const id = randomUUID();
         let timeout: NodeJS.Timeout;
         let isResolved = false;

         const cleanup = async () => {
            if (!isResolved) {
               isResolved = true;
               try {
                  await this.client.unsubscribe(id);
               } catch (error) {
                  console.error('Error unsubscribing:', error);
               }
            }
         };

         timeout = setTimeout(async () => {
            await cleanup();
            reject(
               new Error(`Timeout: No response received within ${timeoutMs}ms`)
            );
         }, timeoutMs);

         this.client
            .subscribe(id, async (message) => {
               if (isResolved) return;

               clearTimeout(timeout);
               await cleanup();

               try {
                  resolve(JSON.parse(message));
               } catch (error) {
                  reject(new Error(`Failed to parse response: ${error}`));
               }
            })
            .catch(reject);

         // Publish the message to the Redis queue
         this.publisher
            .lPush('messages', JSON.stringify({ clientId: id, message }))
            .catch(async (error) => {
               clearTimeout(timeout);
               await cleanup();
               reject(
                  error instanceof Error ? error : new Error(String(error))
               );
            });
      });
   }

   async shutdown(): Promise<void> {
      try {
         await Promise.allSettled([
            this.client?.isOpen ? this.client.disconnect() : Promise.resolve(),
            this.publisher?.isOpen
               ? this.publisher.disconnect()
               : Promise.resolve()
         ]);
      } catch (error) {
         console.error('Error during RedisManager shutdown:', error);
      }
   }

   private async initialize(): Promise<void> {
      await Promise.all([
         this.client.connect().catch(console.error),
         this.publisher.connect().catch(console.error)
      ]);
   }

   private async ensureConnection(): Promise<void> {
      if (this.isConnected) return;

      try {
         this.connectionAttempts++;
         await Promise.all([
            this.client.isOpen ? Promise.resolve() : this.client.connect(),
            this.publisher.isOpen ? Promise.resolve() : this.publisher.connect()
         ]);
      } catch (error) {
         console.error(
            `Connection attempt ${this.connectionAttempts} failed:`,
            error
         );

         const delay =
            this.baseReconnectDelay *
            Math.pow(2, Math.min(this.connectionAttempts - 1, 6));
         console.log(`Retrying in ${delay / 1000} seconds...`);
         await new Promise((resolve) => setTimeout(resolve, delay));
         return this.ensureConnection();
      }
   }

   private setupEventHandlers(): void {
      // Client event handlers
      this.client.on('error', (err) => {
         console.error('RedisManager client connection error');
         this.isConnected = false;
      });

      this.client.on('connect', () => {
         console.log('RedisManager client connection established');
         this.updateConnectionStatus();
      });

      this.client.on('end', () => {
         console.log('RedisManager client connection closed');
         this.isConnected = false;
      });

      // Publisher event handlers
      this.publisher.on('error', () => {
         console.error('RedisManager publisher connection error');
         this.isConnected = false;
      });

      this.publisher.on('connect', () => {
         console.log('RedisManager publisher connection established');
         this.updateConnectionStatus();
      });

      this.publisher.on('end', () => {
         console.log('RedisManager publisher connection closed');
         this.isConnected = false;
      });
   }

   private updateConnectionStatus(): void {
      this.isConnected = this.client.isOpen && this.publisher.isOpen;
      if (this.isConnected) {
         this.connectionAttempts = 0;
      }
   }
}
