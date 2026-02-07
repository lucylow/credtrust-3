// src/websocket/hitl-server.ts
// eslint-disable-next-line @typescript-eslint/no-var-requires
const wsModule = require('ws');
const WsServer = wsModule.Server || wsModule.WebSocketServer;

const wss = new WsServer({ port: 8081 });

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
    console.log('🔌 Connection closed');
  });
});

console.log('✅ HITL WebSocket Server ready');
