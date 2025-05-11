import { createClient, RedisClientType } from 'redis';
import { ChannelName, ConnectionId, OutgoingMessage } from '../utils/types';
import { ConnectionPool } from './connection-pool';

export class ChannelBroker {
   private static instance: ChannelBroker;
   private redisClient: RedisClientType;

   // Tracks connections to channels
   private connectionSubscriptions: Map<ConnectionId, ChannelName[]> =
      new Map();

   // Tracks subscribers per channel
   private channelSubscribers: Map<ChannelName, ConnectionId[]> = new Map();

   private constructor() {
      this.initializeRedisClient();
   }

   static getInstance() {
      if (!ChannelBroker.instance) {
         ChannelBroker.instance = new ChannelBroker();
      }
      return ChannelBroker.instance;
   }

   subscribe(connectionId: string, channel: string): void {
      if (this.isAlreadySubscribed(connectionId, channel)) return;

      this.addSubscription(connectionId, channel);
      this.addSubscriber(channel, connectionId);

      if (this.isFirstSubscriber(channel)) {
         this.redisClient.subscribe(channel, this.handleChannelMessage);
      }
   }

   unsubscribe(connectionId: string, channel: string): void {
      this.removeSubscription(connectionId, channel);
      this.removeSubscriber(channel, connectionId);

      if (this.hasNoSubscribers(channel)) {
         this.redisClient.unsubscribe(channel);
         this.channelSubscribers.delete(channel);
      }
   }

   cleanupConnection(connectionId: string): void {
      const channels = this.connectionSubscriptions.get(connectionId) || [];
      channels.forEach((channel) => this.unsubscribe(connectionId, channel));
      this.connectionSubscriptions.delete(connectionId);
   }

   private initializeRedisClient(): void {
      this.redisClient = createClient();
      this.redisClient
         .connect()
         .then(() => console.log('Connected to Redis'))
         .catch((err) => console.error('Redis connection error:', err));
   }

   private handleChannelMessage = (message: string, channel: string) => {
      const parsedMessage: OutgoingMessage = JSON.parse(message);

      // console.log(parsedMessage);
      const subscribers = this.channelSubscribers.get(channel) || [];

      subscribers.forEach((connectionId) => {
         ConnectionPool.getInstance()
            .getClientConnection(connectionId)
            ?.send(parsedMessage);
      });
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
      return this.channelSubscribers.get(channel)?.length === 0;
   }

   private addSubscription(connectionId: string, channel: string): void {
      const subscriptions =
         this.connectionSubscriptions.get(connectionId) || [];
      this.connectionSubscriptions.set(connectionId, [
         ...subscriptions,
         channel,
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
