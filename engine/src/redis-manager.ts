import { createClient, RedisClientType } from 'redis';
import { DbMessage, MessageToApi, WsMessage } from './types';

export class RedisManager {
   private static instance: RedisManager;
   private client: RedisClientType;

   private constructor() {
      this.client = createClient();
      this.client.connect();
   }

   static getInstance() {
      if (!this.instance) {
         this.instance = new RedisManager();
      }
      return this.instance;
   }

   pushMessage(message: DbMessage) {
      this.client.lPush('db_processor', JSON.stringify(message));
   }

   publishMessage(channel: string, message: WsMessage) {
      this.client.publish(channel, JSON.stringify(message));
   }

   sendToApi(clientId: string, message: MessageToApi) {
      this.client.publish(clientId, JSON.stringify(message));
   }
}
