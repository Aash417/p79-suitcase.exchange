import { randomUUIDv7 } from 'bun';
import { WebSocket } from 'ws';
import { ClientConnection } from './client-connection';

export class ConnectionPool {
   private static instance: ConnectionPool;
   private connections: Map<string, ClientConnection> = new Map();
   private constructor() {}

   static getInstance() {
      if (!ConnectionPool.instance) {
         ConnectionPool.instance = new ConnectionPool();
      }
      return ConnectionPool.instance;
   }

   addConnection(socket: WebSocket): string {
      const connectionId = randomUUIDv7();
      const client = new ClientConnection(connectionId, socket);

      this.connections.set(connectionId, client);
      this.registerCloseHandler(socket, connectionId);

      return connectionId;
   }

   getClientConnection(connectionId: string): ClientConnection | undefined {
      return this.connections.get(connectionId);
   }

   private registerCloseHandler(socket: WebSocket, connectionId: string): void {
      socket.on('close', () => {
         this.connections.delete(connectionId); // remove connection from pool
      });
   }
}
