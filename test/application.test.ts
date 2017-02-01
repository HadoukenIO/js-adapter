import { conn } from "./connect";
import * as assert from "assert";

describe("Application.", () => {
    let fin,
    testApp,
    appConfigTemplate = {
        name: "adapter-test-app",
        url: "http://acidtests.org",
        uuid: "adapter-test-app",
        autoShow: true,
        accelerator: {
            devtools: true
        }
    };
    
    before(() => {
        return conn().then(a => fin = a);
    });

    beforeEach(() => {
        return fin.Application.create(appConfigTemplate).then(a => {
            testApp = a;
            return testApp.run();
        });
    });

    afterEach(() => testApp.close());

    describe("isRunning()", () => {

        it("Fulfilled", () => testApp.isRunning().then(data => assert(data === true)));
    });

    describe("close()",  () => {
        const appToCloseConfig = {
            name: "adapter-test-app-to-close",
            url: "about:blank",
            uuid: "adapter-test-app-to-close",
            autoShow: true
        };
        let appToClose;
        
        before(() => {
            return fin.Application.create(appToCloseConfig).then(a => {
                appToClose = a;
                return appToClose.run();
            });
        });

        it("Fulfilled", () => {
            return appToClose.close().then(() => appToClose.isRunning()
                                           .then(data => assert(data === false)));
        });
    });

    describe("getChildWindows()", () => {

        it("Fulfilled", () => testApp.getChildWindows().then(data => assert(data === [])));
    });

    describe("getGroups()", () => {

        it("Fulfilled", () => testApp.getGroups().then(data => assert(data === [])));
    });

    describe("getParentUuid()",  () => {
        
        it("Fulfilled", () => {
            return testApp.getParentUuid().then(data => assert(data === fin.me.uuid));
        });
    });

    describe("registerCustomData()", () => {
        
        const customData = {
            userId: "mockUser",
            organization: "mockOrg"
        };
        
        it("Fulfilled", () => testApp.registerCustomData(customData).then(data => assert(true)));
    });

    describe("removeTrayIcon()", () => {

        it("Fulfilled", () => testApp.removeTrayIcon().then(data => assert(true)));
    });

    describe("run()", () => {

        const appToCloseConfig = {
            name: "adapter-test-app-to-close",
            url: "about:blank",
            uuid: "adapter-test-app-to-close",
            autoShow: true
        };
        
        let appToClose;

        after(() => appToClose.close());
        
        it("Fulfilled", () => {
            return fin.Application.create(appToCloseConfig).then(a => {
                appToClose = a;
                return appToClose.run().then(() => appToClose.isRunning().then(data => assert(data === true)));
            });
        });
    });

    describe("setTrayIcon()", () => {
        
        const iconUrl = "https://developer.openf.in/download/openfin.png";
        after(() => testApp.removeTrayIcon(iconUrl));

        it("Fulfilled", () => testApp.setTrayIcon(iconUrl).then(data => assert(true)));
    });

    describe("terminate()", () => {

        const appToCloseConfig = {
            name: "adapter-test-app-to-close",
            url: "about:blank",
            uuid: "adapter-test-app-to-close",
            autoShow: true
        };
        let appToClose;
        
        before(() => {
            return fin.Application.create(appToCloseConfig).then(a => {
                appToClose = a;
                return appToClose.run();
            });
        });
        
        it("Fulfilled", () => {
            return appToClose.terminate().then(() => appToClose.isRunning().then(data => assert(data === false)));
        });
    });
});
