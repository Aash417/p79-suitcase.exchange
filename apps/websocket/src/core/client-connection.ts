import { WebSocket } from 'ws';
import { OutgoingMessage } from '../utils/types';
import { ChannelBroker } from './channel-broker';

interface ClientMessage {
   method: 'SUBSCRIBE' | 'UNSUBSCRIBE';
   params: string[];
   id: string;
}

export class ClientConnection {
   constructor(
      public readonly id: string,
      private socket: WebSocket
   ) {
      this.setupMessageHandler();
   }

   send(message: OutgoingMessage): void {
      if (this.socket.readyState === this.socket.OPEN) {
         this.socket.send(JSON.stringify(message));
      }
   }

   private setupMessageHandler(): void {
      this.socket.on('message', (rawMessage) => {
         try {
            const message: ClientMessage = JSON.parse(rawMessage.toString());
            this.handleSubscriptionMessage(message);
         } catch (error) {
            console.error(`Error processing message from ${this.id}:`, error);
         }
      });
   }

   private handleSubscriptionMessage(message: ClientMessage): void {
      const broker = ChannelBroker.getInstance();

      if (message.method === 'SUBSCRIBE') {
         message.params.forEach((channel) =>
            broker.subscribe(this.id, channel)
         );
      } else if (message.method === 'UNSUBSCRIBE') {
         message.params.forEach((channel) =>
            broker.unsubscribe(this.id, channel)
         );
      }
   }
}
