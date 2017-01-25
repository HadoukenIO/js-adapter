const { describe, it } = require("mocha"),
    should = require("should"),
      connect = require("./connect"),
      { Identity, WindowIdentity } = require("../out/identity.js"),
      appConfig = require("./app.json"),
      { connect: rawConnect } = require("../.");


describe("Window.", () => {
    let fin,
        testApp,
        testWindow;

    const appConfigTemplate = {
            "name": "adapter-test-app-win",
            "url": "about:blank",
            "uuid": "adapter-test-app-win",
            "autoShow": true
    };


    before(() => {
        return connect().then(a => fin = a);
    });

    beforeEach(() => {
        return fin.Application.create(appConfigTemplate).then(a => {
            testApp = a;
            return testApp.run().then(() =>  testApp.getWindow().then(w =>  testWindow = w));
        });
    });

   afterEach(() => testApp.close());

    describe("getBounds()", () => {

        const bounds = {
            height: 400,
            width: 400,
            top: 10,
            left: 10
        };

        it("Fulfilled", () => testWindow.setBounds(bounds).then(testWindow.getBounds().should.eventually.have.property("height").a.Number()));
    });

    describe("focus()", () => {

        it("Fulfilled", () => testWindow.focus().should.be.fulfilled());
    });

    describe("blur()", () => {

        it("Fulfilled", () => testWindow.blur().should.be.fulfilled());
    });

    describe("bringToFront()", () => {

        it("Fulfilled", () => testWindow.bringToFront().should.be.fulfilled());
    });

    describe("hide()", () => {

        it("Fulfilled", () => testWindow.hide().should.be.fulfilled());
    });

    describe("close()", () => {

        const appToCloseConfig = {
            "name": "adapter-test-app-to-close",
            "url": "about:blank",
            "uuid": "adapter-test-app-to-close",
            "autoShow": true
        };
        let appToClose,
            winToClose;

        before(() => {
            return fin.Application.create(appToCloseConfig).then(a => {
                appToClose = a;
                return appToClose.run().then(() =>  appToClose.getWindow().then(w =>  winToClose = w));
            });
        });

        it("Fulfilled", () => winToClose.close().then(() => appToClose.isRunning().should.be.fulfilledWith(false)));
    });

    describe("getNativeId()", () => {

        it("Fulfilled", () => testWindow.getNativeId().should.eventually.be.String());
    });

    describe("disableFrame()", () => {

        it("Fulfilled", () => testWindow.disableFrame().should.be.fulfilled());
    });

    describe("enableFrame()", () => {

        it("Fulfilled", () => testWindow.enableFrame().should.be.fulfilled());
    });

    describe("executeJavaScript()", () => {

        const scriptToExecute = "console.log('hello world')";

        it("Descendant Window", () => testWindow.executeJavaScript(scriptToExecute).should.be.fulfilled());

        it("Non descendant Window", () => {
            return rawConnect({
                url: `ws://localhost:9696`,
                uuid: 'SECOND_CONECTION'
            }).then((otherFin) => {
                return otherFin.Window.wrap(new WindowIdentity(testWindow.identity.uuid, testWindow.identity.uuid)).
                    executeJavaScript(scriptToExecute).should.be.rejected();
            });
        });
    });

    describe("flash()", () => {

        it("Fulfilled", () => testWindow.flash().should.be.fulfilled());
    });

    describe("getGroup()", () => {

        it("Fulfilled", () => testWindow.getGroup().should.be.fulfilledWith([]));
    });

    describe("getOptions()", () => {

        it("Fulfilled", () => testWindow.getOptions().should.be.fulfilled());
    });

    describe("getParentApplication()", () => {

        it("Fulfilled", () => testWindow.getParentApplication().should.eventually
           .have.propertyByPath("identity", "uuid").equal(appConfigTemplate.uuid));
    });

    describe("getParentWindow()", () => {

        it("Fulfilled", () => testWindow.getParentWindow().should.eventually
           .have.propertyByPath("identity", "name").equal(appConfigTemplate.uuid));
    });

    describe("getSnapshot()", () => {

        it("Fulfilled", () => testWindow.getSnapshot().should.be.fulfilled());
    });

    describe("getState()", () => {

        it("Fulfilled", () => testWindow.getState().should.eventually.be.String());
    });

    describe("isShowing()", () => {

        it("Fulfilled", () => testWindow.isShowing().should.eventually.be.Boolean());
    });

    //TODO: feature needs testing.
    // describe("joinGroup()", () => {

    //     it("Fulfilled", () => testWindow.joinGroup().should.eventually.be.Boolean());
    // });

    //TODO: feature needs testing.
    // describe("leaveGroup()", () => {

    //     it("Fulfilled", () => testWindow.leaveGroup().should.eventually.be.Boolean());
    // });

    describe("maximize()", () => {

        it("Fulfilled", () => testWindow.maximize().should.be.fulfilled());
    });

    //TODO: feature needs testing.
    // describe("mergeGroups()", () => {

    //     it("Fulfilled", () => testWindow.mergeGroups().should.eventually.be.Boolean());
    // });

    describe("minimize()", () => {

        it("Fulfilled", () => testWindow.minimize().then(() => testWindow.getState()).should.be.fulfilledWith('minimized'));
    });

    describe("moveBy()", () => {

        it("Fulfilled", () => {

            return testWindow.getBounds().then(bounds => {
                bounds.top++;
                bounds.left++;
                bounds.bottom++;
                bounds.right++;

                return testWindow.moveBy(1, 1).then(() => testWindow.getBounds().should.be.fulfilledWith(bounds));
            });

        });
    });

    describe("moveTo()", () => {

        it("Fulfilled", () => {

            return testWindow.getBounds().then(bounds => {
                bounds.top = 10;
                bounds.left = 10;

                return testWindow.moveTo(10, 10).then(() =>  testWindow.getBounds().should.be.fulfilledWith(bounds));
            });
        });
    });

    describe("resizeBy()", () => {

        it("Fulfilled", () => {
            let bounds;

            return testWindow.getBounds().then(b => {
                bounds = b;
                bounds.bottom += 10;
                bounds.right += 10;
                bounds.height += 10;
                bounds.width += 10;

                return testWindow.resizeBy(10, 10, "top-left").then(() => testWindow.getBounds().should.be.fulfilledWith(bounds));
            });
        });
    });

    describe("resizeTo()", () => {

        it("Fulfilled", () => {
            let bounds;

            return testWindow.getBounds().then(b => {
                bounds = b;
                bounds.bottom = 20;
                bounds.right = 20;
                bounds.height = 10;
                bounds.width = 10;

                return testWindow.resizeTo(10, 10, "top-left").then(() => testWindow.getBounds().should.be.fulfilledWith(bounds));
            });
        });
    });

    describe("setAsForeground()", () => {

        it("Fulfilled", () => testWindow.setAsForeground().should.be.fulfilled());
    });

    describe("setBounds()", () => {

        const bounds = {
            height: 400,
            width: 400,
            top: 10,
            left: 10,
            bottom: 410,
            right: 410
        };

        it("Fulfilled", () => testWindow.setBounds(bounds).then(() => testWindow.getBounds().should.be.fulfilledWith(bounds)));
    });

    describe("show()", () => {

        it("Fulfilled", () => testWindow.show().should.be.fulfilled());
    });

    describe("showAt()", () => {

        it("Fulfilled", () => {

            return testWindow.getBounds().then(bounds => {
                bounds.top = 10;
                bounds.left = 10;

                return testWindow.showAt(10, 10).then(() =>  testWindow.getBounds().should.be.fulfilledWith(bounds));
            });
        });
    });

    describe("updateOptions()", () => {

        const updatedOptions = {
            height: 100
        };

        it("Fulfilled", () => testWindow.updateOptions(updatedOptions).should.be.fulfilled());
    });

    //TODO: feature needs testing.
    // describe("authenticate()", () => {

    //     it("Fulfilled", () => testWindow.authenticate(10, 10).should.be.fulfilled());
    // });

    describe("getZoomLevel()", () => {

        it("Fulfilled", () => testWindow.getZoomLevel().should.be.fulfilledWith(0));
    });

    describe("setZoomLevel()", () => {

        const zoomLevel = 1;

        it("Fulfilled", () => testWindow.setZoomLevel(zoomLevel).then(() => testWindow.getZoomLevel()).should.be.fulfilledWith(zoomLevel));
    });
});
