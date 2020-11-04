import WebSocket from 'ws';

export const init = () => {
  const socketServer = new WebSocket.Server({
    port: 8888,
  });

  const ws = new WebSocket('ws://localhost:8888/waitingroom');
  ws.on('open', function open() {
    ws.send('open');
  });

  socketServer.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });
   
    ws.send('something');
  });
  
  return {
    socketServer
  }
}
