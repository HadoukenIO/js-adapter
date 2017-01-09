const { describe, it } = require("mocha"),
      should = require("should"),
      connect = require("./connect"),
      { Identity, WindowIdentity } = require("../out/identity.js");

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
        return connect().then(a => fin = a);
    });

     beforeEach(() => {
        return fin.Application.create(appConfigTemplate).then(a => {
            testApp = a;
            return testApp.run();
        });
    });

   afterEach(() => testApp.close());

    describe("isRunning()", () => {

        it("Promise", () => testApp.isRunning().should.be.a.Promise());

        it("Fulfilled", () => testApp.isRunning().should.be.fulfilledWith(true));
    });

    describe("close()",  () => {
        const appToCloseConfig = {
            "name": "adapter-test-app-to-close",
            "url": "about:blank",
            "uuid": "adapter-test-app-to-close",
            "autoShow": true
        };
        let appToClose;
        
        before(() => {
            return fin.Application.create(appToCloseConfig).then(a => {
                appToClose = a;
                return appToClose.run();
            });
        });

        it("Fulfilled", () => {
            return appToClose.close().then(() => appToClose.isRunning().should.be.fulfilledWith(false));
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

    describe("getParentUuid()",  () => {
        
        it("Fulfilled", () => {
            return testApp.getParentUuid().should.be.fulfilledWith(fin.me.uuid);
        });
    });
             
    describe("getWindow()", () => {

        it("Promise", () => testApp.getWindow().should.be.a.Promise());

        it("Fulfilled", () => testApp.getWindow().should.be.
           fulfilledWith(fin.Window.wrap(new WindowIdentity(appConfigTemplate.uuid, appConfigTemplate.uuid))));
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

        const appToCloseConfig = {
            "name": "adapter-test-app-to-close",
            "url": "about:blank",
            "uuid": "adapter-test-app-to-close",
            "autoShow": true
        };
        
        let appToClose;

        after(() => appToClose.close());
        
        it("Fulfilled", () => {
            return fin.Application.create(appToCloseConfig).then(a => {
                appToClose = a;
                return appToClose.run().then(() => appToClose.isRunning().should.be.fulfilledWith(true));
            });
        });
    });

    describe("setTrayIcon()", () => {
        
        const iconUrl = "https://developer.openf.in/download/openfin.png";
        after(() => testApp.removeTrayIcon(iconUrl));

        it("Fulfilled", () => testApp.setTrayIcon(iconUrl).should.be.fulfilled());
    });

    describe("terminate()", () => {

        const appToCloseConfig = {
            "name": "adapter-test-app-to-close",
            "url": "about:blank",
            "uuid": "adapter-test-app-to-close",
            "autoShow": true
        };
        let appToClose;
        
        before(() => {
            return fin.Application.create(appToCloseConfig).then(a => {
                appToClose = a;
                return appToClose.run();
            });
        });
        
        it("Fulfilled", () => {
            return appToClose.terminate().then(() => appToClose.isRunning().should.be.fulfilledWith(false));
        });
    });
});
