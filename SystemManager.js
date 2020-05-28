const Verifications = require("./Verifications");
const log = LOGGER("System Manager");

module.exports = class SystemManager {
    constructor(options) {
        this.moduleClasses = [];
        this.apiClasses = [];

        this.injectedInstances = [];

        this.moduleInstances = [];
    }

    registerModule(mod) {
        if (!mod.type) {
            throw new Error(`Module type not found when registering module with class name >>${mod.name}<<. Has "static type='your_type_here'" not been set in the class?`);
        }
        log(`Registered module type >${mod.type}<`);
        this.moduleClasses.push(mod);
    }

    load(model) {
        log(`Beginning load...`);
        Verifications.VerfiyModel(model); //Will throw an error if the model is invalid.
        log("Model verified, instantiating module classes.");

        for (const definition of model.modules) {
            //Find and instantiate the class the definition's referring to.
            const cls = this.moduleClasses.find((cls) => cls.type === definition.type);
            if (!cls) {
                throw new Error(`Error loading model: Couldn't find module with type >>${definition.type}<< for definition with uid >${definition.uid}<`)
            }

            this.moduleInstances.push(new cls(definition));
        }

        this.moduleInstances.concat(this.injectedInstances);

        log("Module classes instantiated, linking IO.");
        /*Link module IO*/
        for(const mod of this.moduleInstances) {
            for(const input of mod._inputs) {
                for(const target of input.targets) {

                    //Find the target module. Index 0 in the target tuple.
                    const t = this.moduleInstances.find(m => m.uid === target[0]);
                    if(!t) {
                        throw new Error(`Couldn't find target output [>>${target[0]}<<, ${target[1]}] when linking input [${mod.uid}, ${input.uid}]. This is probably a typo in the definition for "${mod.uid}"`);
                    }

                    //Find the target output. Index 1 of the target tuple
                    const out = t._outputs.find(o => o.uid === target[1]);
                    if(!out) {
                        throw new Error(`Couldn't find target output [${target[0]}, >>${target[1]}<<] when linking input [${mod.uid}, ${input.uid}]. This is probably a typo in the definition for "${mod.uid}"`);
                    }

                    //Link the output to the input.
                    try {
                        out.pipeTo(input);
                    } catch (e) {
                        throw new Error(`Error while linking input >[${mod.uid}, ${input.uid}]< to output >[${t.uid}, ${out.uid}]<: ${e}`);
                    }

                }
            }
        }

        log("Load finished, initing modules.");

        for(const mod of this.moduleInstances) {
            if(mod.init) {
                mod.init();
            }
        }
    }
};