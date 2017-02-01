import { conn } from "./connect";
import * as assert from "assert";

describe("System.", () => {
    let fin;
    
    before(() => {
        return conn().then(a => fin = a);
    });

    describe("getVersion()", () => {
        
        it("Fulfilled", () => fin.System.getVersion().then(() => assert(true)));
    });

    describe("clearCache()", () => {
        
        it("Fulfilled", () => fin.System.clearCache().then(() => assert(true)));
    });

    describe("deleteCacheOnExit()", () => {

        it("Fulfilled", () => fin.System.deleteCacheOnExit().then(() => assert(true)));
    });

    describe("getAllWindows()", () => {
        
        it("Fulfilled", () => fin.System.getAllWindows().then(() => assert(true)));
    });

    describe("getAllApplications()", () => {
        
        it("Fulfilled", () => fin.System.getAllApplications().then(() => assert(true)));
    });

    describe("getCommandLineArguments()", () => {
        
        it("Fulfilled", () => fin.System.getCommandLineArguments().then(() => assert(true)));
    });

    describe("getDeviceId()", () => {
        
        it("Fulfilled", () => fin.System.getDeviceId().then(() => assert(true)));
    });

    describe("getEnvironmentVariable()", () => {
        
        it("Fulfilled", () => fin.System.getEnvironmentVariable().then(() => assert(true)));
    });

    describe("getLog()", () => {
        let logOpts = {
            name: "debug.log"
        };
        
        it("Fulfilled", () => fin.System.getLog(logOpts).then(() => assert(true)));
    });

    describe("getLogList()", () => {
        
        it("Fulfilled", () => fin.System.getLogList().then(() => assert(true)));
    });

    describe("getMonitorInfo()", () => {
        
        it("Fulfilled", () => fin.System.getMonitorInfo().then(() => assert(true)));
    });

    describe("getMousePosition()", () => {
        
        it("Fulfilled", () => fin.System.getMousePosition().then(() => assert(true)));
    });

    describe("getProcessList()", () => {
        
        it("Fulfilled", () => fin.System.getProcessList().then(() => assert(true)));
    });

    describe("getProxySettings()", () => {
        
        it("Fulfilled", () => fin.System.getProxySettings().then(() => assert(true)));
    });
    
    describe("launchExternalProcess()", () => {
        const processOptions = {
            path: "notepad",
            arguments: "",
            listener: code => {}
        };
                
        it("Fulfilled", () => fin.System.launchExternalProcess(processOptions)
           .then(() => assert(true)));
    });

    // incompatible with standalone node process.
    // describe("monitorExternalProcess()", () => {
    //     const pid = process.pid;
        
    //     it("Promise", () =>  fin.System.monitorExternalProcess(pid)
    //        .should.be.a.Promise());
        
    //     it("Fulfilled", () => fin.System.monitorExternalProcess(pid)
    //        .should.be.fulfilled());
    // });

    describe("log()", () => {
        const level = "info";
        const message = "log this";
        
        it("Fulfilled", () => fin.System.log(level, message)
           .then(() => assert(true)));
    });

    describe("openUrlWithBrowser()", () => {
        const url = "http://www.openfin.co";
        
        it("Fulfilled", () => fin.System.openUrlWithBrowser(url)
           .then(() => assert(true)));
    });

    //TODO: Runtime bug prevents this from working on stand alone node.
    // describe("releaseExternalProcess()", () => {
    //     let uuid;

    //     before(() => {
    //         return fin.System.monitorExternalProcess(process.pid).then(ep => uuid = ep.uuid);
    //     });
        
	//     it("Promise", () =>  fin.System.releaseExternalProcess(uuid).should.be.a.Promise());
        
	//     it("Fulfilled", () => fin.System.releaseExternalProcess(uuid).should.be.fulfilled());
    // });

    //TODO: Need to start a test app as part of the test setup.
    describe("showDeveloperTools()", () => {
        const identity = {
            uuid: "testerApp",
            name: "testerApp"
        };
        
        it("Fulfilled", () => fin.System.showDeveloperTools(identity)
           .then(() => assert(true)));
    });

    describe("updateProxySettings()", () => {
        const proxySettings = {
            type: "type",
            address:"address"
        };
        
        it("Fulfilled", () => fin.System.updateProxySettings(proxySettings)
           .then(() => assert(true)));
    });

    describe("getAllExternalApplications()", () => {
        
        it("Fulfilled", () => fin.System.getAllExternalApplications()
           .then(() => assert(true)));
    });

    describe("resolveUuid()", () => {
        it("should resolve a known uuid", () => fin.System.resolveUuid(fin.me.uuid).then(data => assert(data === {
            type: "external-app",
            uuid: fin.me.uuid
        })));

        it("should fail on a unknown uuid", () => fin.System.resolveUuid("fake_uuid").catch(() => assert(true)));
    });
    
});
