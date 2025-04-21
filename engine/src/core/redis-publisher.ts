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

   sendToClient(clientId: string, message: ApiMessage) {
      this.client.publish(clientId, JSON.stringify(message));
   }

   sendToWs(channel: string, message: WsMessage) {
      this.client.publish(channel, JSON.stringify(message));
   }

   sendToDb(message: DbMessage) {
      this.client.lPush('db_processor', JSON.stringify(message));
   }
}
