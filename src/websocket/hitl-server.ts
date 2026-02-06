// src/websocket/hitl-server.ts
import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8081 });

console.log('🚀 HITL WebSocket Server starting on port 8081...');

wss.on('connection', (ws) => {
  console.log('🔌 New connection established');

  ws.on('message', (data) => {
    console.log('📩 Received message:', data.toString());
    
    // Broadcast to all other clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on('close', () => {
    console.log('❌ Connection closed');
  });

  ws.on('error', (error) => {
    console.error('⚠️ WebSocket error:', error);
  });
});

console.log('✅ HITL WebSocket Server is ready');
