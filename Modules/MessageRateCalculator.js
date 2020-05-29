const Module = require("./Module");

class MessageRateCalculator extends Module{
    static type = "rate_calculator";
    constructor(definition) {
        super(definition);
        if(!definition.source) {
            throw new Error(`Error loading module uid >${this.uid}<: definition field >>source<< is not present.`)
        }

        this.dataInput = new Module.Input("dataIn", "any", definition.source);
        this.dataInput.on("data", this.onData.bind(this));

        this.addInput(this.dataInput);
        setInterval(this.reset.bind(this), 1000);
    }

    reset() {
        console.log(`Rate: ${this.ct}/sec`);
        this.ct = 0;

    }

    onData(event) {
        this.ct++;
    }

}

module.exports = MessageRateCalculator;