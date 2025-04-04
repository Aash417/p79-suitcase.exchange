import { createClient, RedisClientType } from 'redis';
import { UserManager } from './user-manager';

export class SubscriptionManager {
   private static instance: SubscriptionManager;

   private subscriptions: Map<string, string[]> = new Map();
   private reverseSubscriptions: Map<string, string[]> = new Map();
   private redisClient: RedisClientType;

   private constructor() {
      this.redisClient = createClient();
      this.redisClient
         .connect()
         .catch((err) => console.error('Redis connection error', err));
   }

   public static getInstance() {
      if (!this.instance) {
         this.instance = new SubscriptionManager();
      }
      return this.instance;
   }

   public subscribe(userId: string, subscription: string) {
      if (this.subscriptions.get(userId)?.includes(subscription)) return;

      this.subscriptions.set(
         userId,
         (this.subscriptions.get(userId) || []).concat(subscription),
      );

      this.reverseSubscriptions.set(
         subscription,
         (this.reverseSubscriptions.get(subscription) || []).concat(userId),
      );

      if (this.reverseSubscriptions.get(subscription)?.length === 1) {
         this.redisClient.subscribe(subscription, this.redisCallbackHandler);
      }
   }

   public unsubscribe(userId: string, subscription: string) {
      const subscriptions = this.subscriptions.get(userId);

      if (subscription) {
         this.subscriptions.set(
            userId,
            subscriptions?.filter((s) => s !== subscription) || [],
         );
      }

      const reverseSubscriptions = this.reverseSubscriptions.get(subscription);
      if (reverseSubscriptions) {
         this.reverseSubscriptions.set(
            subscription,
            reverseSubscriptions.filter((s) => s !== userId),
         );

         if (this.reverseSubscriptions.get(subscription)?.length === 0) {
            this.redisClient.unsubscribe(subscription);
            this.reverseSubscriptions.delete(subscription);
         }
      }
   }

   public getSubscriptions(userId: string) {
      return this.subscriptions.get(userId) || [];
   }

   public userLeft(userId: string) {
      const subscriptions = this.subscriptions.get(userId);

      if (subscriptions) {
         subscriptions.forEach((sub) => {
            this.unsubscribe(userId, sub);
         });
      }
   }

   private redisCallbackHandler(data: string, channel: string) {
      const message = JSON.parse(data);
      const reverseSubscriptions = this.reverseSubscriptions.get(channel);

      if (reverseSubscriptions) {
         reverseSubscriptions.forEach((user) =>
            UserManager.getInstance().getUser(user)?.emit(message),
         );
      }
   }
}
