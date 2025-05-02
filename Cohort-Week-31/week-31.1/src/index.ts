import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const subscriptions: {[key: string]: {
    ws: WebSocket,
    rooms: string[]
}} = {

}

setInterval(() => {
    console.log(subscriptions);
}, 5000);

wss.on('connection', function connection(userSocket) {
    const id = randomId();
    subscriptions[id] = {
        ws: userSocket,
        rooms: []
    }

    userSocket.on('message', function message(data) {
        const parsedMessage = JSON.parse(data as unknown as string);
        if (parsedMessage.type === 'SUBSCRIBE') {
            subscriptions[id].rooms.push(parsedMessage.room);
        }
        
        if (parsedMessage.type === 'UNSUBSCRIBE') {
            subscriptions[id].rooms = subscriptions[id].rooms.filter(x => x !== parsedMessage.room)
        }

        if (parsedMessage.type === 'sendMessage') {
            const message = parsedMessage.message;
            const roomId = parsedMessage.roomId;

            Object.keys(subscriptions).forEach((userId) => {
                const {ws, rooms} = subscriptions[userId];
                if (rooms.includes(roomId)) {
                    ws.send(message);
                }
            })
        }
    });

});

function randomId() {
    return Math.random();
}