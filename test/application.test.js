const { describe, it } = require("mocha"),
      should = require("should"),
      connect = require("./connect"),
      { Identity, WindowIdentity } = require("../out/identity.js"),
      appConfig = require("./app.json");

describe("Application.", () => {
    let fin,
        testApp,
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
        return connect().then(a => {
            fin = a;
            testApp = fin.Application.wrap(new Identity(appConfig.startup_app.uuid));
        });
    });

    describe("isRunning()", () => {

        it("Promise", () => testApp.isRunning().should.be.a.Promise());

        it("Fulfilled", () => testApp.isRunning().should.be.fulfilledWith(true));
    });

    describe("close()",  () => {
                
        before(() => fin.Application.create(appConfigTemplate));

        it("Fulfilled", () => {
            let myApp = fin.Application.wrap(new Identity("adapter-test-app"));
            return myApp.close().then(() => myApp.isRunning().should.be.fulfilledWith(false));
        });
    });

    describe("getChildWindows()", () => {
        
        it("Promise", () => testApp.getChildWindows().should.be.a.Promise());

        it("Fulfilled", () => testApp.getChildWindows().should.be.fulfilledWith([]));
    });

    describe("getGroups()", () => {
        
        it("Promise", () => testApp.getGroups().should.be.a.Promise());

        it("Fulfilled", () => testApp.getGroups().should.be.fulfilledWith([]));
    });

    describe("getGroups()", () => {
        
        it("Promise", () => testApp.getGroups().should.be.a.Promise());

        it("Fulfilled", () => testApp.getGroups().should.be.fulfilledWith([]));
    });

    describe("getManifest()", () => {
        
        it("Promise", () => testApp.getManifest().should.be.a.Promise());

        it("Fulfilled", () => testApp.getManifest().should.be.fulfilledWith(appConfig));
    });

    describe("getParentUuid()",  () => {
        
        before(() => fin.Application.create(appConfigTemplate).then(app => app.run()));

        after(() => fin.Application.wrap(new Identity("adapter-test-app")).close(true));
        
        it("Fulfilled", () => {
            let myApp = fin.Application.wrap(new Identity("adapter-test-app"));
            return myApp.getParentUuid().should.be.fulfilledWith(fin.me.uuid);
        });
    });
             
    describe("getWindow()", () => {

        it("Promise", () => testApp.getWindow().should.be.a.Promise());

        it("Fulfilled", () => testApp.getWindow().should.be.fulfilledWith(fin.Window.wrap(new WindowIdentity(appConfig.startup_app.uuid, appConfig.startup_app.uuid))));
    });

    describe("registerCustomData()", () => {
        
        const customData = {
            userId: "mockUser",
            organization: "mockOrg"
        };
        
        it("Promise", () => testApp.registerCustomData(customData).should.be.a.Promise());
        
        it("Fulfilled", () => testApp.registerCustomData(customData).should.be.fulfilled());
    });

    describe("removeTrayIcon()", () => {
        
        it("Promise", () => testApp.removeTrayIcon().should.be.a.Promise());

        it("Fulfilled", () => testApp.removeTrayIcon().should.be.fulfilled());
    });

    describe("run()", () => {

        after(() => fin.Application.wrap(new Identity("adapter-test-app")).close(true));
        
        it("Fulfilled", () => {
            let app;
            return fin.Application.create(appConfigTemplate).then(a => {
                app = a;
                return app.run().then(() => app.isRunning().should.be.fulfilledWith(true));
            });
        });
    });

    describe("setTrayIcon()", () => {
        
        const iconUrl = "https://developer.openf.in/download/openfin.png";
        after(() => testApp.removeTrayIcon(iconUrl));

        it("Fulfilled", () => testApp.setTrayIcon(iconUrl).should.be.fulfilled());
    });

    describe("terminate()", () => {
        
        before(() => fin.Application.create(appConfigTemplate));

        it("Fulfilled", () => {
            let myApp = fin.Application.wrap(new Identity("adapter-test-app"));
            return myApp.terminate().then(() => myApp.isRunning().should.be.fulfilledWith(false));
        });
    });
});
