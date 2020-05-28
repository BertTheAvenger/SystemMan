const SystemManager = require("./index.js");
const Module = require("./Module");
const ModuleEndpoint = require("./ModuleEndpoint");

const sm = new SystemManager();

/*
* Producer:
* I: N/A;
* O: "out1" number;
*
* */

const model = {
    modules: [
        {
            type: "producer",
            uid: "pr1",
        },
        {
            type: "consumer",
            uid: "c1",
            numIn: ["pr1", "numOut"]
        },
    ]
};


class testProducer extends Module{
    static type="producer";
    constructor(definition) {
        super(definition);
        this.out = new Module.Output("numOut", "number");
        this.addOutput(this.out);

    }

    init(){
        //this.out.push("lelelel");
        //this.out.push("lelelel321234");
        //this.out.push("lelelelafsvdasdf");
    }
}

class testConsumer extends Module{
    static type="consumer";
    constructor(definition) {
        super(definition);
        this.in = new Module.Input("numIn", "number", definition.numIn);
        this.in.on("data", (data) => console.log(data));
        this.addInput(this.in);
    }
}



sm.registerModule(testProducer);
sm.registerModule(testConsumer);
sm.injectAPI(new ModuleEndpoint());

sm.load(model);


require("./ModuleTest");