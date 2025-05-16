import { WS_URL } from '@/lib/env';

type Callback = {
   id: string;
   callback: (data: any) => void;
};
type CallbackMap = Record<string, Callback[]>;

export class WebSocketManager {
   private static instance: WebSocketManager;
   private readonly ws: WebSocket;
   private bufferedMessages: any[] = [];
   private callbacks: CallbackMap = {};
   private messageId = 1;
   private initialized = false;

   private constructor() {
      this.ws = new WebSocket(WS_URL);
      this.setupWebSocket();
   }

   static getInstance(): WebSocketManager {
      if (!WebSocketManager.instance) {
         WebSocketManager.instance = new WebSocketManager();
      }
      return WebSocketManager.instance;
   }

   sendMessage(message: any) {
      const messageToSend = { ...message, id: this.messageId++ };

      if (!this.initialized) {
         this.bufferedMessages.push(messageToSend);
      } else {
         this.ws.send(JSON.stringify(messageToSend));
      }
   }

   registerCallback(type: string, callback: (data: any) => void, id: string) {
      if (!this.callbacks[type]) {
         this.callbacks[type] = [];
      }
      this.callbacks[type].push({ callback, id });
   }

   deRegisterCallback(type: string, id: string) {
      const callbacks = this.callbacks[type];
      if (!callbacks) return;
      this.callbacks[type] = callbacks.filter((cb) => cb.id !== id);
   }

   private setupWebSocket() {
      this.ws.onopen = () => {
         this.initialized = true;
         this.drainBufferedMessages();
      };

      this.ws.onmessage = (event) => {
         this.handleMessage(event.data);
      };

      this.ws.onerror = (error) => {
         console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
         console.log('WebSocket connection closed');
         this.initialized = false;
      };
   }

   private drainBufferedMessages() {
      this.bufferedMessages.forEach((message) => {
         this.ws.send(JSON.stringify(message));
      });
      this.bufferedMessages = [];
   }

   private handleMessage(rawData: string) {
      const message = JSON.parse(rawData);
      const type = message.data.e;
      const callbacks = this.callbacks[type];
      if (!callbacks) return;

      callbacks.forEach(({ callback }) => {
         if (type === 'depth') {
            callback({
               bids: message.data.b,
               asks: message.data.a,
            });
         }
         if (type === 'ticker') {
            callback({
               firstPrice: message.data.o,
               lastPrice: message.data.c,
               high: message.data.h,
               low: message.data.l,
               volume: message.data.v,
               quoteVolume: message.data.V,
               symbol: message.data.s,
            });
         }
         if (type === 'trade') {
            callback({
               id: message.data.t,
               price: message.data.p,
               quantity: message.data.q,
               timestamp: Math.floor(message.data.T / 1000),
               isBuyerMaker: message.data.m,
            });
         }
      });
   }
}
