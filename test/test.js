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
            type: "test_module",
            uid: "tm1",
            physicalUid: 12498120890981,
            connectionProvider: ["connectionProducer", "connections"],
        }
    ]
};

sm.registerModule(require("../Modules/Physical/ModuleConnectionProducer"));
sm.registerModule(require("~/Modules/Physical/TestModule"));
sm.load(model);


require("./ModuleEmulator");