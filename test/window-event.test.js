const { describe, it } = require("mocha"),
    sinon = require("sinon"),
    should = require("should"),
    connect = require("./connect"),
    delayPromise = require("./delay-promise"),
      { Identity } = require("../.");
    
require("should-sinon");

describe("Window.addEventListener()", () => {
    let testApp,
        fin,
        appConfigTemplate = {
            "name": "adapter-test-app",
            "url": "http://acidtests.org",
            "uuid": "adapter-test-app",
            "autoShow": true,
            "accelerator": {
                "devtools": true
            }
        };

    before(() => {
        return connect().then(a => fin = a);
    });
    
    describe('"closed"', () => {

        before(() => fin.Application.create(appConfigTemplate).then(app => app.run()));
        
        it("called", () => {
            const spy = sinon.spy();

            return fin.Application.wrap(new Identity("adapter-test-app")).getWindow().then(win => {
                
                win.on("closed", spy);

                return win.close()
                    .then(() => delayPromise())
                    .then(() => spy.should.be.calledOnce());
            });
        });
    });
    
});
