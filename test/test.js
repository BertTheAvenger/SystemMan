require("~/Env/EnvSetup");

const SystemManager = require("~/SystemManager.js");
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
            type: "module_connection_producer",
            uid: "connectionProducer",
        },
        {
            type: "P_ir_distance_sensor",
            uid: "irds1",
            physicalUid: 918,
            module_connections: ["connectionProducer", "connections"],
        },
        {
            type: "rate_calculator",
            uid: "consoleLog1",
            source: ["irds1", "distance_out"],
        }
    ]
};

sm.registerModule(require("../Modules/Physical/ModuleConnectionProducer"));
sm.registerModule(require("~/Modules/Physical/TestModule"));
sm.registerModule(require("~/Modules/ConsoleLogger"));
sm.registerModule(require("~/Modules/Physical/IRDistanceSensor"));
sm.registerModule(require("~/Modules/MessageRateCalculator"));
sm.load(model);


//require("./ModuleEmulator");