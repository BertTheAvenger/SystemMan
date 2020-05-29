const PhysicalModule = require("./PhysicalModule");

class IRDisanceSensor extends PhysicalModule{
    static type="P_ir_distance_sensor";
    constructor(definition) {
        super(definition);

        this.distanceOutput = new PhysicalModule.Output("distance_out", "number");
        this.addOutput(this.distanceOutput);
    }

    _setupConnection(ws) {
        ws.on("message", this.handleMessage.bind(this));
        ws.send(JSON.stringify({
            type: "command",
            command: "start",
            rate: 0
        }));
    }

    handleMessage(msg) {
        try{
            //const obj = JSON.parse(msg);
            this.distanceOutput.push(1);
        } catch (e) {
            
        }

    }

}

module.exports = IRDisanceSensor;