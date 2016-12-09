const { describe, it } = require("mocha"),
      should = require("should"),
      connect = require("./connect"),
      { spawn } = require("child_process");


describe("System.", () => {
    let fin;
    
    before(() => {
        return connect().then(a => fin = a);
    });

    describe("getVersion()", () => {
	
	    it("Promise", () => fin.System.getVersion().should.be.a.Promise());
        
	    it("Fulfilled", () => fin.System.getVersion().should.be.fulfilled());
    });

    describe("clearCache()", () => {
	
	    it("Promise", () => fin.System.clearCache().should.be.a.Promise());
        
	    it("Fulfilled", () => fin.System.clearCache().should.be.fulfilled());
    });

    describe("deleteCacheOnExit()", () => {

    	it("Promise", () => fin.System.deleteCacheOnExit().should.be.a.Promise());

        it("Fulfilled", () => fin.System.deleteCacheOnExit().should.be.fulfilled());
    });

    describe("getAllWindows()", () => {
        
	    it("Promise", () =>  fin.System.getAllWindows().should.be.a.Promise());
        
	    it("Fulfilled", () => fin.System.getAllWindows().should.be.fulfilled());	
    });

    describe("getAllApplications()", () => {
        
	    it("Promise", () => fin.System.getAllApplications().should.be.a.Promise());
        
	    if("Fulfilled", () => fin.System.getAllApplications().should.be.fulfilled());
    });

    describe("getCommandLineArguments()", () => {
        
	    it("Promise", () =>  fin.System.getCommandLineArguments().should.be.a.Promise());
        
	    it("Fulfilled", () => fin.System.getCommandLineArguments().should.be.fulfilled());
    });

    describe("getDeviceId()", () => {
        
	    it("Promise", () =>  fin.System.getDeviceId().should.be.a.Promise());
        
	    it("Fulfilled", () => fin.System.getDeviceId().should.be.fulfilled());
    });

    describe("getEnvironmentVariable()", () => {
        
	    it("Promise", () =>  fin.System.getEnvironmentVariable().should.be.a.Promise());
        
	    it("Fulfilled", () => fin.System.getEnvironmentVariable().should.be.fulfilled());
    });

    describe("getLog()", () => {
        let logOpts = {
            name: "debug.log"
        };
        
	    it("Promise", () =>  fin.System.getLog(logOpts).should.be.a.Promise());
        
	    it("Fulfilled", () => fin.System.getLog(logOpts).should.be.fulfilled());
    });

    describe("getLogList()", () => {
        
	    it("Promise", () =>  fin.System.getLogList().should.be.a.Promise());
        
	    it("Fulfilled", () => fin.System.getLogList().should.be.fulfilled());
    });

    describe("getMonitorInfo()", () => {
        
	    it("Promise", () =>  fin.System.getMonitorInfo().should.be.a.Promise());
        
	    it("Fulfilled", () => fin.System.getMonitorInfo().should.be.fulfilled());
    });

    describe("getMousePosition()", () => {
        
	    it("Promise", () =>  fin.System.getMousePosition().should.be.a.Promise());
        
	    it("Fulfilled", () => fin.System.getMousePosition().should.be.fulfilled());
    });

    describe("getProcessList()", () => {
        
	    it("Promise", () =>  fin.System.getProcessList().should.be.a.Promise());
        
	    it("Fulfilled", () => fin.System.getProcessList().should.be.fulfilled());
    });

    describe("getProxySettings()", () => {
        
	    it("Promise", () =>  fin.System.getProxySettings().should.be.a.Promise());
        
        it("Fulfilled", () => fin.System.getProxySettings().should.be.fulfilled());
    });
    
    describe("launchExternalProcess()", () => {
        const processOptions = {
            path: "notepad",
	        arguments: "",
	        listener: function(code) {
		        console.log('the exit code', code);
	        }
	    };
        
        it("Promise", () =>  fin.System.launchExternalProcess(processOptions)
           .should.be.a.Promise());
        
        it("Fulfilled", () => fin.System.launchExternalProcess(processOptions)
           .should.be.fulfilled());
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
        
	    it("Promise", () =>  fin.System.log(level, message)
           .should.be.a.Promise());
        
	    it("Fulfilled", () => fin.System.log(level, message)
           .should.be.fulfilled());
    });

    describe("openUrlWithBrowser()", () => {
        const url = "http://www.openfin.co";
        
	    it("Promise", () =>  fin.System.openUrlWithBrowser(url)
           .should.be.a.Promise());
        
	    it("Fulfilled", () => fin.System.openUrlWithBrowser(url)
           .should.be.fulfilled());
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
            
	    it("Promise", () =>  fin.System.showDeveloperTools(identity)
           .should.be.a.Promise());
        
	    it("Fulfilled", () => fin.System.showDeveloperTools(identity)
           .should.be.fulfilled());
    });

    describe("terminateExternalProcess()", () => {
        let pid;
        
        beforeEach(() => {
            pid = spawn("notepad", [], {}).pid;
        });
        
	    it("Promise", () =>  {
            return spawn("notepad", [], {}, p => {
                return fin.System.monitorExternalProcess(p.pid).then(ep => {
                    return fin.System.terminateExternalProcess({
                        uuid:ep.uuid,
                        timeout:3000,
                        killTree: true
                    }).should.be.a.Promise();
                });
            });
        });
        
	    it("Fulfilled", () => {
            return spawn("notepad", [], {}, p => {
                return fin.System.monitorExternalProcess(p.pid).then(ep => {
                    return fin.System.terminateExternalProcess({
                        uuid:ep.uuid,
                        timeout:3000,
                        killTree: true
                    }).should.be.fulfilled();
                });
            });
        });
    });

    describe("updateProxySettings()", () => {
        const proxySettings = {
            type: "type",
            address:"address"
        };
            
	    it("Promise", () =>  fin.System.updateProxySettings(proxySettings)
           .should.be.a.Promise());
        
	    it("Fulfilled", () => fin.System.updateProxySettings(proxySettings)
           .should.be.fulfilled());
    });

    describe("getAllExternalApplications()", () => {
        it("Promise", () =>  fin.System.getAllExternalApplications()
           .should.be.a.Promise());
        
	    it("Fulfilled", () => fin.System.getAllExternalApplications()
           .should.be.fulfilled());        
    });
});
