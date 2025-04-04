import { WebSocket } from 'ws';
import { SubscriptionManager } from './subscription-manager';
import { IncomingMessage, OutgoingMessage } from './types';

export class User {
   private id: string;
   private ws: WebSocket;

   constructor(id: string, ws: WebSocket) {
      this.id = id;
      this.ws = ws;
   }

   private subscription: string[] = [];

   public subscribe(subscription: string) {
      this.subscription.push(subscription);
   }

   public unsubscribe(subscription: string) {
      this.subscription = this.subscription.filter((s) => s !== subscription);
   }

   public emit(message: OutgoingMessage) {
      this.ws.send(JSON.stringify(message));
   }

   private addListener() {
      this.ws.on('message', (message: string) => {
         const parsedMessage: IncomingMessage = JSON.parse(message);

         if (parsedMessage.method === 'SUBSCRIBE') {
            parsedMessage.data.forEach((subscription: string) => {
               SubscriptionManager.getInstance().subscribe(
                  this.id,
                  subscription,
               );
            });
         }
         if (parsedMessage.method === 'UNSUBSCRIBE') {
            SubscriptionManager.getInstance().unsubscribe(
               this.id,
               parsedMessage.data[0],
            );
         }
      });
   }
}
