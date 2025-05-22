import { WebSocketServer } from 'ws';
import { ConnectionPool } from './core/connection-pool';

const PORT = 3003;

export function main() {
   const wss = new WebSocketServer({ port: PORT });

   wss.on('connection', (socket) => {
      ConnectionPool.getInstance().addConnection(socket);
   });

   console.log(`WebSocket server running on ws://localhost:${PORT}`);
}

main();
