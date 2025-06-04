import type { EngineToApiMessage } from '@repo/shared-types/messages/api-engine';
import type { WebSocketToClientMessage } from '@repo/shared-types/messages/client-websocket';
import { type RedisClientType, createClient } from 'redis';

export class RedisService {
   private static instance: RedisService;
   private readonly client: RedisClientType;
   private isConnected = false;
   private connectionAttempts = 0;
   private readonly baseReconnectDelay = 1000;

   private constructor() {
      const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
      console.log(`RedisService connecting to ${redisUrl}`);

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
            this.baseReconnectDelay *
            Math.pow(2, Math.min(this.connectionAttempts - 1, 6));
         console.log(`Retrying in ${delay / 1000} seconds...`);
         await new Promise((resolve) => setTimeout(resolve, delay));
         return this.ensureConnection();
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
         console.error(`Error sending to client ${clientId}:`, error);

         if (retries > 0) {
            const delay = 100 * (4 - retries);
            await new Promise((resolve) => setTimeout(resolve, delay));
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

      try {
         await this.client.publish(channel, JSON.stringify(message));
      } catch (error) {
         console.error(
            `Failed to send to WebSocket channel ${channel}:`,
            error
         );
         throw error;
      }
   }

   async sendToDb(message: { type: string; data: any }): Promise<void> {
      await this.ensureConnection();

      try {
         await this.client.lPush('db_processor', JSON.stringify(message));
      } catch (error) {
         console.error('Failed to send to database queue:', error);
         throw error;
      }
   }

   // Consumer methods
   async popFromQueue(
      queueName: string,
      timeoutMs = 2000
   ): Promise<string | null> {
      await this.ensureConnection();

      try {
         return await this.client.rPop(queueName);
      } catch (error) {
         console.error(`Error popping from queue ${queueName}:`, error);
         throw error;
      }
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
            console.error(`Error processing queue ${queueName}:`, error);
            await new Promise((resolve) => setTimeout(resolve, 2000));
         }
      }
   }

   async shutdown(): Promise<void> {
      try {
         if (this.client?.isOpen) {
            await this.client.disconnect();
         }
      } catch (error) {
         console.error('Error during RedisService shutdown:', error);
      }
   }

   private setupEventHandlers(): void {
      this.client.on('error', () => {
         console.error('RedisService connection error');
         this.isConnected = false;
      });

      this.client.on('connect', () => {
         console.log('RedisService connection established');
         this.isConnected = true;
         this.connectionAttempts = 0;
      });

      this.client.on('reconnecting', () => {
         console.log('RedisService client reconnecting...');
         this.isConnected = false;
      });

      this.client.on('end', () => {
         console.log('RedisService connection closed');
         this.isConnected = false;
      });
   }
}
