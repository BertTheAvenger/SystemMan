const Module = require("./Module");

class ConsoleLogger extends Module{
    static type = "console_logger";
    constructor(definition) {
        super(definition);
        if(!definition.source) {
            throw new Error(`Error loading module uid >${this.uid}<: definition field >>source<< is not present.`)
        }

        this.dataInput = new Module.Input("dataIn", "any", definition.source);
        this.dataInput.on("data", this.onData);

        this.addInput(this.dataInput);
    }

    onData(event) {
        console.log(event.data);
    }

}

module.exports = ConsoleLogger;