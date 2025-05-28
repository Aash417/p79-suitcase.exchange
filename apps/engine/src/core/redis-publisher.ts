import { type RedisClientType, createClient } from 'redis';

type WsMessage = {
   stream: string;
   data: Record<string, any>;
};

type ApiMessage = {
   type: string;
   payload: any;
};

type DbMessage = {
   type: string;
   data: any;
};

export class RedisPublisher {
   private static instance: RedisPublisher;
   private readonly client: RedisClientType;

   private constructor() {
      const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
      this.client = createClient({ url: redisUrl });

      // Set up event handlers
      this.client.on('error', (err) => {
         console.error('Redis connection error:', err);
      });

      this.client.connect();
   }

   static getInstance(): RedisPublisher {
      if (!this.instance) {
         this.instance = new RedisPublisher();
      }
      return this.instance;
   }

   async sendToClient(
      clientId: string,
      message: ApiMessage,
      retries = 3
   ): Promise<boolean> {
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

   async sendToWs(channel: string, message: WsMessage): Promise<void> {
      await this.client.publish(channel, JSON.stringify(message));
   }

   async sendToDb(message: DbMessage): Promise<void> {
      await this.client.lPush('db_processor', JSON.stringify(message));
   }
}
