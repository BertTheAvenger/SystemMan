const Module = require("../Module");
const log = LOGGER("ConnectionProducer");

const WebSocket = require("ws");

class ModuleConnectionProducer extends Module {
    static type = "module_connection_producer";

    constructor(definition) {
        super(definition);

        this.connectionOutput = new Module.Output("connections", "ModuleConnection");

        this.addOutput(this.connectionOutput);
    }

    init(){
        this.wss = new WebSocket.Server({port: 420}, () => {});
        this.wss.on("connection", (ws) => this.onConnection(this.wss, ws));
    }

    onConnection(wss, ws) {
        ws.on("message", (msg) => this.identifyConnection(wss, ws, msg));
        log("New connection received.");
    }

    identifyConnection(wss, ws, msg) {
        try {
            //Parse and validate the incoming "ID" packet.
            const obj = JSON.parse(msg);
            if(!obj || !obj.type || !obj.uid) {
                throw new Error("Sent JSON doesn't have a required field. ");
            }
            log(`Module type >${obj.type}< identified with uid >${obj.uid}<`);

            //Remove the message listener.
            ws.removeAllListeners();

            //Pass an object with data about the socket's physical module and allow a module to claim it using claim().
            let claimed = false;
            const dataObj = { //TODO: Can be optimized to not create a new object each time.
                type: obj.type,
                uid: obj.uid,
                claim: () => {
                    claimed = true;
                    return ws;
                },
            };
            this.connectionOutput.push(dataObj);


            if(!claimed) {
                log(`Physical module connection with type >${obj.type}< and uid >${obj.uid}< wasn't claimed. It will not be used.`, "warn");
            } else {
                log(`Physical module connection with type >${obj.type}< and uid >${obj.uid}< was claimed. Yay!`);
            }

        } catch (e) {
            log(`Error parsing message >>${msg}<<. ${e}`, "warn");
        }
    }
}

module.exports = ModuleConnectionProducer;