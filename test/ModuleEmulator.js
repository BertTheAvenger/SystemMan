const WebSocket = require("ws");
const log = LOGGER("ModuleEmulator");
log("Starting test module...");

const idPacket = {
    type: "test_module",
    uid: 12498120890981, //Emulates MAC in int form.
};


async function start() {
    const ws = await new Promise((res) => {
        const ws = new WebSocket("ws://localhost:420");
        ws.onopen = () => res(ws);
    });
    log("Test WS open, sending ID packet");

    function onMsg() {

    }
    ws.onmessage = onMsg;

    ws.send(JSON.stringify(idPacket));
}

start();