import type { EngineToApiMessage } from '@suitcase/shared-types/messages/api-engine';
import type { WebSocketToClientMessage } from '@suitcase/shared-types/messages/client-websocket';
import { type RedisClientType, createClient } from 'redis';

export class RedisService {
   private static instance: RedisService;
   private readonly client: RedisClientType;
   private isConnected = false;
   private connectionAttempts = 0;
   private readonly baseReconnectDelay: number;

   private constructor() {
      const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
      this.baseReconnectDelay = 1000;

      this.client = createClient({ url: redisUrl });
      this.setupEventHandlers();
   }

   static getInstance(): RedisService {
      if (!this.instance) {
         this.instance = new RedisService();
      }
      return this.instance;
   }

   async ensureConnection(): Promise<void> {
      if (this.isConnected) return;

      try {
         this.connectionAttempts++;
         await this.client.connect();
      } catch (error) {
         console.error(
            `Connection attempt ${this.connectionAttempts} failed:`,
            error
         );

         const delay =
            this.baseReconnectDelay * Math.pow(2, this.connectionAttempts - 1);
         console.log(`Retrying in ${delay / 1000} seconds...`);
         await new Promise((resolve) => setTimeout(resolve, delay));
         return this.ensureConnection(); // Keep retrying until connected
      }
   }

   // Publishing methods
   async sendToClient(
      clientId: string,
      message: EngineToApiMessage,
      retries = 3
   ): Promise<boolean> {
      await this.ensureConnection();

      try {
         await this.client.publish(clientId, JSON.stringify(message));
         return true;
      } catch (error) {
         if (retries > 0) {
            await new Promise((resolve) =>
               setTimeout(resolve, 100 * (4 - retries))
            );
            return this.sendToClient(clientId, message, retries - 1);
         }
         console.error(`Failed to send to ${clientId} after 3 attempts`);
         throw error;
      }
   }

   async sendToWs(
      channel: string,
      message: WebSocketToClientMessage
   ): Promise<void> {
      await this.ensureConnection();
      await this.client.publish(channel, JSON.stringify(message));
   }

   async sendToDb(message: { type: string; data: any }): Promise<void> {
      await this.ensureConnection();
      await this.client.lPush('db_processor', JSON.stringify(message));
   }

   // Consumer methods
   async popFromQueue(
      queueName: string,
      timeoutMs = 2000
   ): Promise<string | null> {
      await this.ensureConnection();
      return await this.client.rPop(queueName);
   }

   async *processQueue(
      queueName: string
   ): AsyncGenerator<string, void, unknown> {
      while (true) {
         try {
            const message = await this.popFromQueue(queueName);
            if (message) {
               yield message;
            } else {
               await new Promise((resolve) => setTimeout(resolve, 100));
            }
         } catch (error) {
            console.error('Error processing queue:', error);
            await new Promise((resolve) => setTimeout(resolve, 2000));
         }
      }
   }

   async shutdown(): Promise<void> {
      try {
         if (this.client.isOpen) {
            await this.client.disconnect();
         }
      } catch (error) {
         console.error('Error during Redis shutdown:', error);
      }
   }

   private setupEventHandlers(): void {
      this.client.on('error', (err) => {
         console.error('Redis connection error');
         this.isConnected = false;
      });

      this.client.on('connect', () => {
         console.log('Redis connection established');
         this.isConnected = true;
         this.connectionAttempts = 0;
      });

      this.client.on('reconnecting', () => {
         console.log('Redis client reconnecting...');
         this.isConnected = false;
      });

      this.client.on('end', () => {
         console.log('Redis connection closed');
         this.isConnected = false;
      });
   }
}
