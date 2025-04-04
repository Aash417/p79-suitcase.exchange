import { WebSocketServer } from 'ws';
import { UserManager } from './user-manager';

const wss = new WebSocketServer({ port: 3003 });

wss.on('connection', (ws) => {
   UserManager.getInstance().addUser(ws);
});

console.log('WebSocket server started on ws://localhost:3003');
