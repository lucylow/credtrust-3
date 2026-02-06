// src/websocket/hitl-server.ts
const wsModule = require('ws');
const WebSocketServer = wsModule.Server;
const WebSocket = wsModule;

const wss = new (wsModule.Server || wsModule.WebSocketServer)({ port: 8081 });

console.log('🚀 HITL WebSocket Server starting on port 8081...');

wss.on('connection', (ws: any) => {
  console.log('🔌 New connection established');

  ws.on('message', (data: any) => {
    console.log('📩 Received message:', data.toString());
    
    // Broadcast to all other clients
    wss.clients.forEach((client: any) => {
      if (client !== ws && client.readyState === (wsModule.OPEN || 1)) {
        client.send(data);
      }
    });
  });

  ws.on('close', () => {
    console.log('❌ Connection closed');
  });

  ws.on('error', (error: any) => {
    console.error('⚠️ WebSocket error:', error);
  });
});

console.log('✅ HITL WebSocket Server is ready');
