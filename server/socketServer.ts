import WebSocket from 'ws';

const wsTable = [] as any[];

export const init = (): { socketServer: WebSocket.Server } => {
  const socketServer = new WebSocket.Server({
    port: 8888,
    clientTracking: true
  });

  const gamehost = new WebSocket('ws://localhost:8888/game')
  gamehost.on('open', () => { gamehost.send('open') });
  // gamehost.on('connection', (ws) => {})
  

  const ws = new WebSocket('ws://localhost:8888/waitingroom');
  ws.on('open', function open() {
    ws.send('open');
  });

  socketServer.on('connection', function connection(ws) {
    if(!wsTable.includes(ws)){
      wsTable.push(ws);
    }
    else {
      console.log('=== ws found');
    }

    ws.on('message', function incoming(message) {
      ws.send(message);
    });
   
    ws.send('connected');
  });
  
  return {
    socketServer
  }
}
