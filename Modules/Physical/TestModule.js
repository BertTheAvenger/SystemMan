const PhysicalModule = require("./PhysicalModule");
class TestModule extends PhysicalModule {
    static type='test_module';
    constructor(definition) {
        super(definition);
        this.connectionInput.on("data", this.connection.bind(this));
        this.ws = null;
    }

    connection(event) {
        const c = event.data;
        if(c.uid === this.physicalUid) {
            this.setupConnection(c.claim());
        }
    }

    setupConnection(ws) {
        this.ws = ws;
    }
}

module.exports = TestModule;