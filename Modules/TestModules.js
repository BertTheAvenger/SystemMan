const Module = require("./Module");

class testProducer extends Module{
    static type="producer";
    constructor(definition) {
        super(definition);
        this.out = new Module.Output("numOut", "number");
        this.addOutput(this.out);

    }

    init(){
        this.out.push("Test Producer Output");
        //this.out.push("lelelel321234");
        //this.out.push("lelelelafsvdasdf");
    }
}

class testConsumer extends Module{
    static type="consumer";
    constructor(definition) {
        super(definition);
        console.log(definition);
        this.in = new Module.Input("numIn", "number", definition.numIn);
        this.addInput(this.in);


        this.in.on("data", (data) => console.log(data));

    }
}

const testDef = [
    {
        type: "consumer",
        uid:"cons1",
        numIn: ["prod1", "numOut"]
    },
    {
        type:"producer",
        uid:"prod1",
    }
];


module.exports = {testProducer, testConsumer, testDef};