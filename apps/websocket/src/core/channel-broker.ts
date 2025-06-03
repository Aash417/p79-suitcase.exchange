import { createClient, type RedisClientType } from 'redis';
import type { ChannelName, ConnectionId } from '../utils/types';
import { ConnectionPool } from './connection-pool';

export class ChannelBroker {
   private static instance: ChannelBroker;
   private redisClient!: RedisClientType;
   private isConnected = false;
   private connectionAttempts = 0;
   private readonly baseReconnectDelay = 1000;

   // Tracks connections to channels
   private readonly connectionSubscriptions: Map<ConnectionId, ChannelName[]> =
      new Map();
   // Tracks subscribers per channel
   private readonly channelSubscribers: Map<ChannelName, ConnectionId[]> =
      new Map();

   private constructor() {
      this.initializeRedisClient();
   }

   static getInstance(): ChannelBroker {
      if (!ChannelBroker.instance) {
         ChannelBroker.instance = new ChannelBroker();
      }
      return ChannelBroker.instance;
   }

   async subscribe(connectionId: string, channel: string): Promise<void> {
      if (this.isAlreadySubscribed(connectionId, channel)) return;

      await this.ensureConnection();

      this.addSubscription(connectionId, channel);
      this.addSubscriber(channel, connectionId);

      if (this.isFirstSubscriber(channel)) {
         try {
            await this.redisClient.subscribe(
               channel,
               this.handleChannelMessage
            );
         } catch (error) {
            console.error(`Failed to subscribe to channel ${channel}:`, error);
            // Rollback changes if Redis subscription fails
            this.removeSubscription(connectionId, channel);
            this.removeSubscriber(channel, connectionId);
            throw error;
         }
      }
   }

   async unsubscribe(connectionId: string, channel: string): Promise<void> {
      this.removeSubscription(connectionId, channel);
      this.removeSubscriber(channel, connectionId);

      if (this.hasNoSubscribers(channel)) {
         try {
            await this.ensureConnection();
            await this.redisClient.unsubscribe(channel);
            this.channelSubscribers.delete(channel);
         } catch (error) {
            console.error(
               `Failed to unsubscribe from channel ${channel}:`,
               error
            );
         }
      }
   }

   async cleanupConnection(connectionId: string): Promise<void> {
      const channels = this.connectionSubscriptions.get(connectionId) || [];
      await Promise.allSettled(
         channels.map((channel) => this.unsubscribe(connectionId, channel))
      );
      this.connectionSubscriptions.delete(connectionId);
   }

   async shutdown(): Promise<void> {
      try {
         if (this.redisClient?.isOpen) {
            await this.redisClient.disconnect();
         }
      } catch (error) {
         console.error('Error during Redis shutdown:', error);
      }
   }

   private async ensureConnection(): Promise<void> {
      if (this.isConnected || this.redisClient.isOpen) return;

      try {
         this.connectionAttempts++;
         await this.redisClient.connect();
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

   private initializeRedisClient(): void {
      const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
      console.log(`ChannelBroker connecting to ${redisUrl}`);

      this.redisClient = createClient({ url: redisUrl });
      this.setupEventHandlers();
   }

   private setupEventHandlers(): void {
      this.redisClient.on('error', () => {
         console.error('ChannelBroker Redis connection error');
         this.isConnected = false;
      });

      this.redisClient.on('connect', () => {
         console.log('ChannelBroker Redis connection established');
         this.isConnected = true;
         this.connectionAttempts = 0;
      });

      this.redisClient.on('reconnecting', () => {
         console.log('ChannelBroker Redis client reconnecting...');
         this.isConnected = false;
      });

      this.redisClient.on('end', () => {
         console.log('ChannelBroker Redis connection closed');
         this.isConnected = false;
      });
   }

   private readonly handleChannelMessage = (
      message: string,
      channel: string
   ) => {
      try {
         const parsedMessage = JSON.parse(message);
         const subscribers = this.channelSubscribers.get(channel) || [];

         subscribers.forEach((connectionId) => {
            try {
               ConnectionPool.getInstance()
                  .getClientConnection(connectionId)
                  ?.send(parsedMessage);
            } catch (error) {
               console.error(
                  `Failed to send message to connection ${connectionId}:`,
                  error
               );
            }
         });
      } catch (error) {
         console.error(
            `Failed to parse message from channel ${channel}:`,
            error
         );
      }
   };

   private isAlreadySubscribed(connectionId: string, channel: string): boolean {
      return (
         this.connectionSubscriptions.get(connectionId)?.includes(channel) ??
         false
      );
   }

   private isFirstSubscriber(channel: string): boolean {
      return this.channelSubscribers.get(channel)?.length === 1;
   }

   private hasNoSubscribers(channel: string): boolean {
      return (this.channelSubscribers.get(channel)?.length ?? 0) === 0;
   }

   private addSubscription(connectionId: string, channel: string): void {
      const subscriptions =
         this.connectionSubscriptions.get(connectionId) || [];
      this.connectionSubscriptions.set(connectionId, [
         ...subscriptions,
         channel
      ]);
   }

   private addSubscriber(channel: string, connectionId: string): void {
      const subscribers = this.channelSubscribers.get(channel) || [];
      this.channelSubscribers.set(channel, [...subscribers, connectionId]);
   }

   private removeSubscription(connectionId: string, channel: string): void {
      const subscriptions =
         this.connectionSubscriptions
            .get(connectionId)
            ?.filter((c) => c !== channel) || [];
      this.connectionSubscriptions.set(connectionId, subscriptions);
   }

   private removeSubscriber(channel: string, connectionId: string): void {
      const subscribers =
         this.channelSubscribers
            .get(channel)
            ?.filter((id) => id !== connectionId) || [];
      this.channelSubscribers.set(channel, subscribers);
   }
}
