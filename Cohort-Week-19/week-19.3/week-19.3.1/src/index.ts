import WebSocket, { WebSocketServer } from "ws";
import http from 'http';

const server = http.createServer(function(request: any, response: any) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.end("hit there");
});

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function connection(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });

    ws.send('Hello! Message from Server!!');
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080 ');
});