const WebSocket = require("ws");

console.log("Starting test module...");

const idPacket = {
    type: "test_module",
    mUid: "1337",
};

const S_OPENING_SOCKET = 1;
const S_WAITING_FOR_SOCKET = 2;
const S_WAITING_FOR_MESSAGE = 3;
const S_MESSAGE_RECEIVED = 4;


let state = S_OPENING_SOCKET;
let latestMsg = null;
let socket = null;

function messageRecieved(msg) {
    latestMsg = msg.data;
    state = S_MESSAGE_RECEIVED;
}

function fsm() {
    switch (state) {
        case S_OPENING_SOCKET: {
            socket = new WebSocket("ws://localhost:420");
            socket.onmessage = messageRecieved;
            state = S_WAITING_FOR_SOCKET;
            break;
        }
        case S_WAITING_FOR_SOCKET: {
            switch (socket.readyState) {
                case 1:
                    socket.send(JSON.stringify(idPacket));
                    state = S_WAITING_FOR_MESSAGE;

                    break;
                case 2:
                    console.error("WS broke :(");
                    break;
                default:
                    break;
            }
            break;
        }
        case S_WAITING_FOR_MESSAGE: {
            break;
        }

        case S_MESSAGE_RECEIVED:
            //console.log("lsl");
            console.log(latestMsg);
            state = S_WAITING_FOR_MESSAGE;
            break;
    }

    setTimeout(fsm, 10);
}

setTimeout(fsm, 0);