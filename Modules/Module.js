const Stream = require("stream");
const EventEmitter = require("events");
const Event = require("../Event");

/*----------------Output Class----------------*/
class Output extends EventEmitter{
    constructor(uidStr, typeStr) {
        super();
        this.uid = uidStr;
        this.type = typeStr;
        this.pipedInputs = [];
        this.evt = new Event();
    }

    push(data) {
        for(const i of this.pipedInputs) {
            this.evt.data = data;
            i.ingest(this.evt);
        }
    }

    pipeTo(input) {
        if(!(input.types.includes(this.type) || input.types.includes("any"))) {
            throw new Error(`Type mis-match between output type >${this.type}< and input types >${input.types}<.`)
        }

        this.pipedInputs.push(input);
    }

    setMetaData(meta) {
        this.evt.sourceType = meta.sourceType;
        this.evt.sourceUid = meta.sourceUid;
    }
}


/*----------------Input Class----------------*/
class Input extends EventEmitter {
    constructor(uid, types, target) {
        super();
        let fTarget;
        if (!target || !Array.isArray(target)) {
            throw new Error(`Couldn't create Input "${uid}": Target doesn't exist or isn't at least a tuple`);
        }

        //If false, we have a single target. Wrap it in an array.
        if(!Array.isArray(target[0]) ) {
            fTarget = [target];
        } else {
            fTarget = target;
        }

        this.targets = fTarget;
        this.types = Array.isArray(types) ? types : [types];
        this.uid = uid;
    }

    ingest(event) {
        this.emit("data", event);
    }
}


/*-------------Main Class-------------*/
class Module {
    static Input = Input;
    static Output = Output;

    constructor(definition) {
        this._outputs = [];
        this._inputs = [];

        if (!definition) {
            throw new Error(`Error while loading definition for module type "${this.constructor.type}": definition is undefined. (Did you forget to pass it to super in a module constructor?)`);
        }
        if (!definition.uid) {
            throw new Error(`Error while loading definition for module type "${this.constructor.type}": field "uid" not present.`);
        }

        this._uid = definition.uid;
    }

    get uid() {return this._uid;}

    addOutput(outputInst) {
        this._outputs.push(outputInst);
        outputInst.setMetaData({sourceType: this.constructor.type, sourceUid: this._uid});
    }

    addInput(inputInst) {
        this._inputs.push(inputInst);
    }
}

module.exports = Module;