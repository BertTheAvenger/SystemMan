const Verifications = require("./Verifications");

module.exports = class SystemManager {
    constructor(options) {
        this.moduleClasses = [];
        this.injectedInstances = [];
        this.moduleInstances = [];
        this.globalApis = [];
    }

    registerModule(mod) {
        if (!mod.type) {
            throw new Error(`Module type not found when registering module with class name "${mod.name}". Has "static type='your_type_here'" not been set in the class?`);
        }


        this.moduleClasses.push(mod);
    }

    load(model) {
        Verifications.VerfiyModel(model); //Will throw an error if the model is invalid.

        for (const definition of model.modules) {
            //Find and instantiate the class the definition's referring to.
            const cls = this.moduleClasses.find((cls) => cls.type === definition.type);
            if (!cls) {
                throw new Error(`Error loading model: Couldn't find module with type "${definition.type}" for definition with uid "${definition.uid}"`)
            }

            this.moduleInstances.push(new cls(definition));
        }

        this.moduleInstances.concat(this.injectedInstances);

        /*Link module IO*/
        for(const mod of this.moduleInstances) {
            for(const input of mod._inputs) {
                const t = this.moduleInstances.find(m => m.uid === input.targetUid);
                if(!t) {
                    throw new Error();
                }
                const out = t._outputs.find(o => o.uid === input.outputUid);
                if(!out) {
                    throw new Error();
                }

                out.linkInput(input);
            }
        }

        for(const mod of this.moduleInstances) {
            if(mod.init) {
                mod.init(this.globalApis);
            }
        }
    }

    injectModuleInstance(inst) {
        this.injectedInstances.push(inst);
    }

    injectAPI(name, api) {
        this.globalApis[name] = api;
    }
};