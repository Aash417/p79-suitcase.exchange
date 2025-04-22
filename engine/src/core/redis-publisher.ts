import { RedisClientType, createClient } from 'redis';

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
   private client: RedisClientType;

   private constructor() {
      this.client = createClient();
      this.client.connect();
   }

   static getInstance(): RedisPublisher {
      if (!this.instance) {
         this.instance = new RedisPublisher();
      }
      return this.instance;
   }

   async sendToClient(clientId: string, message: ApiMessage, retries = 3) {
      try {
         this.client.publish(clientId, JSON.stringify(message));
         return true;
      } catch (error) {
         if (retries > 0) {
            await new Promise((resolve) =>
               setTimeout(resolve, 100 * (4 - retries)),
            );
            return this.sendToClient(clientId, message, retries - 1);
         }
         console.error(`Failed to send to ${clientId} after 3 attempts`);
         throw error;
      }
   }

   sendToWs(channel: string, message: WsMessage) {
      this.client.publish(channel, JSON.stringify(message));
   }

   sendToDb(message: DbMessage) {
      this.client.lPush('db_processor', JSON.stringify(message));
   }
}
