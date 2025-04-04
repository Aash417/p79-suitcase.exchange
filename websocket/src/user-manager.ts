import { SubscriptionManager } from './subscription-manager';
import { User } from './user';

export class UserManager {
   private static instance: UserManager;
   private user: Map<string, User> = new Map();

   private constructor() {}

   public static getInstance() {
      if (!this.instance) {
         this.instance = new UserManager();
      }
      return this.instance;
   }

   private getRandomId() {
      return Math.floor(Math.random() * 1000000).toString(16);
   }

   public addUser(ws) {
      const id = this.getRandomId();
      const user = new User(id, ws);

      this.user.set(id, user);
      this.registerOnClose(ws, id);
   }

   private registerOnClose(ws, id) {
      ws.on('close', () => {
         this.user.delete(id);
         SubscriptionManager.getInstance().userLeft(id);
      });
   }

   public getUser(id: string) {
      return this.user.get(id);
   }
}
