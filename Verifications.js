module.exports =
    {
        VerfiyModel: (model) => {
            const prefix = "Error while verifying model: ";
            if (!model) {
                throw new Error(`${prefix}model was undefined`);
            }
            if (!model.modules) {
                throw new Error(`${prefix}model.modules was undefined`);
            }

            /*Type checking*/
            if (!Array.isArray(model.modules)) {
                throw new Error(`${prefix}model.modules isn't an array.`);
            }
        },
};