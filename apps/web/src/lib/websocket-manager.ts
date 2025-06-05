import { WS_URL } from '@/lib/env';
import type {
   ClientToWebSocketMessage,
   WebSocketToClientMessage
} from '@repo/shared-types/messages/client-websocket';

type Callback = (data: any) => void;

export class WebSocketManager {
   private static instance: WebSocketManager;
   private ws: WebSocket | null = null;
   private bufferedMessages: unknown[] = [];
   private readonly callbacks: Map<string, Map<string, Callback>> = new Map();
   private messageId = 1;
   private initialized = false;
   private reconnectAttempts = 0;
   private readonly maxReconnectDelay = 30000;

   private constructor() {
      this.connect();
   }

   static getInstance(): WebSocketManager {
      if (!WebSocketManager.instance) {
         WebSocketManager.instance = new WebSocketManager();
      }
      return WebSocketManager.instance;
   }

   private connect() {
      this.ws = new WebSocket(WS_URL);
      this.setupWebSocket();
   }

   private setupWebSocket() {
      if (!this.ws) return;
      this.ws.onopen = () => {
         this.initialized = true;
         this.reconnectAttempts = 0;
         this.drainBufferedMessages();
      };

      this.ws.onmessage = (event) => {
         this.handleMessage(event.data);
      };

      this.ws.onerror = () => {
         console.error('WebSocket error');
         this.scheduleReconnect();
      };

      this.ws.onclose = () => {
         this.initialized = false;
         this.scheduleReconnect();
      };
   }

   private scheduleReconnect() {
      this.reconnectAttempts++;
      const delay = Math.min(
         1000 * 2 ** this.reconnectAttempts,
         this.maxReconnectDelay
      );
      console.log('reconnecting in ', delay, 'ms');
      setTimeout(() => this.connect(), delay);
   }

   sendMessage(message: ClientToWebSocketMessage) {
      const messageToSend = { ...message, id: this.messageId++ };
      if (
         !this.initialized ||
         !this.ws ||
         this.ws.readyState !== WebSocket.OPEN
      ) {
         this.bufferedMessages.push(messageToSend);
      } else {
         this.ws.send(JSON.stringify(messageToSend));
      }
   }

   registerCallback(type: string, callback: Callback, id: string) {
      if (!this.callbacks.has(type)) {
         this.callbacks.set(type, new Map());
      }
      this.callbacks.get(type)!.set(id, callback);
   }

   deRegisterCallback(type: string, id: string) {
      const typeMap = this.callbacks.get(type);
      if (!typeMap) return;
      typeMap.delete(id);
      if (typeMap.size === 0) {
         this.callbacks.delete(type);
      }
   }

   private drainBufferedMessages() {
      if (!this.ws) return;
      this.bufferedMessages.forEach((message) => {
         this.ws!.send(JSON.stringify(message));
      });
      this.bufferedMessages = [];
   }

   private handleMessage(rawData: string) {
      let message: WebSocketToClientMessage;
      try {
         message = JSON.parse(rawData);
      } catch {
         return;
      }
      const type = message.data.e;
      const typeMap = this.callbacks.get(type);
      if (!typeMap) return;

      // Throttle or batch updates here if needed for high-frequency types

      for (const callback of typeMap.values()) {
         if (type === 'depth') {
            callback({
               bids: message.data.b,
               asks: message.data.a
            });
         } else if (type === 'ticker') {
            callback({
               firstPrice: message.data.o,
               lastPrice: message.data.c,
               high: message.data.h,
               low: message.data.l,
               volume: message.data.v,
               quoteVolume: message.data.V,
               symbol: message.data.s
            });
         } else if (type === 'trade') {
            callback({
               id: message.data.t,
               price: message.data.p,
               quantity: message.data.q,
               timestamp: Math.floor(message.data.T / 1000),
               isBuyerMaker: message.data.m
            });
         }
      }
   }
}
