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

    function sendData(){
        ws.send(Math.floor(Math.random() * 100));
    }


    let intervalControl = null;
    function onMsg(msg) {
        let obj = JSON.parse(msg.data);
        switch (obj.type) {
            case "command":
                switch (obj.command) {
                    case "start":
                        intervalControl = setInterval(sendData, 1000);
                        log("Start command received.");
                        break;
                    case "stop":
                        clearInterval(intervalControl);
                        log("Stop command received.");
                        break;
                }
                break;
            case "setparam":
                break;
            case "request":
                break;

        }

    }
    ws.onmessage = onMsg;

    ws.send(JSON.stringify(idPacket));
}

start();