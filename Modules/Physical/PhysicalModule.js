const Module = require("../Module");

class PhysicalModule extends Module{
    constructor(definition) {
        super(definition);
        if(!definition.physicalUid) {
            throw new Error(`Error while constructing physical module with uid >${this.uid}< : Definition field >physicalUid< was not present.`);
        }
        if(!definition.connectionProvider) {
            throw new Error(`Error while constructing physical module with uid >${this.uid}< : Definition field >connectionProvider< was not present.`);
        }

        this.physicalUid = definition.physicalUid;
        this.connectionInput = new Module.Input("module_connections", "ModuleConnection", definition.connectionProvider);

        this.addInput(this.connectionInput);
    }
}

module.exports = PhysicalModule;