const WebSocket = require("ws");

class ModuleEndpoint {
    constructor() {
        this.wss = new WebSocket.Server({port: 420});
        this.wss.on("connection", (ws) => this.onConnection(this.wss, ws));
    }

    onConnection(wss, ws) {
        ws.on("message", (msg) => this.identifyConnection(wss, ws, msg));

    }

    identifyConnection(wss, ws, msg) {
        try {
            const obj = JSON.parse(msg);
            console.log(obj);

        } catch (e) {
            console.log(`Error parsing message  ${msg}`);
        }
        ws.send("lel");
    }
}

module.exports = ModuleEndpoint;