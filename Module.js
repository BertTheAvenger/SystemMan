const Stream = require("stream");
const EventEmitter = require("events");


/*----------------Output Class----------------*/
class Output {
    constructor(uidStr, typeStr, options) {
        this.uid = uidStr;
        this.type = typeStr;
        this.streams = [];
    }

    push(data) {
        for (const stream of this.streams) {
            stream.push(data);
        }
    }

    linkInput(input) {
        if (input.types.includes(this.type) || input.types.includes("any")) {
            const stream = new OutputStream();
            stream.pipe(input.stream);
            this.streams.push(stream);
        }
    }
}

class OutputStream extends Stream.Readable {
    constructor() {
        super({objectMode: true});
    }

    _read() {}
}


/*----------------Input Class----------------*/
class Input extends EventEmitter {
    constructor(uid, types, target, options) {
        super();
        if (!target || !Array.isArray(target)) {
            throw new Error(`Couldn't create Input ${uid}: Target doesn't exist or isn't a tuple`);
        }

        this.targetUid = target[0];
        this.outputUid = target[1];
        this.types = Array.isArray(types) ? types : [types];
        this.stream = new Stream.Writable({
            objectMode: true,
            write: (chunk, encoding, next) => {
                this.emit("data", chunk);
                next();
            }
        })
    }
}


/*-------------Main Class-------------*/
module.exports = class Module {
    static Output = Output;
    static Input = Input;

    constructor(definition) {
        this._outputs = [];
        this._inputs = [];
        if (!definition) {
            throw new Error(`Error while loading definition for module type "${this.constructor.type}": definition is undefined. (How did this even happen...?)`);
        }
        if (!definition.uid) {
            throw new Error(`Error while loading definition for module type "${this.constructor.type}": field "uid" not present.`);
        }
        this._uid = definition.uid;
    }


    get uid() {return this._uid;}

    addOutput(outputInst) {
        this._outputs.push(outputInst);
    }

    addInput(inputInst) {
        this._inputs.push(inputInst);
    }
};

