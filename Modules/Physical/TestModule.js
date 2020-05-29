const PhysicalModule = require("./PhysicalModule");
class TestModule extends PhysicalModule {
    static type='test_module';
    constructor(definition) {
        super(definition);
        this.ws = null;

        this.numOut = new PhysicalModule.Output("data_out", "number");
        this.addOutput(this.numOut);
    }

    _setupConnection(ws) {
        this.ws = ws;
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.send(JSON.stringify({
            type: "command",
            command: "start",
        }));
    }

    //Expects msg to be a single number.
    onMessage(msg) {
        this.numOut.push(msg.data);
    }

}

module.exports = TestModule;