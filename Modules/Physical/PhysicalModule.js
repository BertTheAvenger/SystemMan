const Module = require("../Module");

class PhysicalModule extends Module{
    constructor(definition) {
        super(definition);
        if(!definition.physicalUid) {
            throw new Error(`Error while constructing physical module with uid >${this.uid}< : Definition field >physicalUid< was not present.`);
        }
        if(!definition.module_connections) {
            throw new Error(`Error while constructing physical module with uid >${this.uid}< : Definition field >connectionProvider< was not present.`);
        }
        if(!this._setupConnection) {
            throw new Error(`Function >>_setupConnection(ws)<< is not implemented in physical module type >${this.constructor.type}<.`)
        }

        this.physicalUid = definition.physicalUid;
        this.connectionInput = new Module.Input("module_connections", "ModuleConnection", definition.module_connections);

        this.connectionInput.on("data", this.connection.bind(this));

        this.addInput(this.connectionInput);
    }

    connection(event) {
        const c = event.data;
        if(c.uid === this.physicalUid) {
            this._setupConnection(c.claim());
        }
    }
}

module.exports = PhysicalModule;