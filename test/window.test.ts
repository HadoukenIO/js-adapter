import { conn } from './connect';
import * as assert from 'assert';
import { connect as rawConnect, Fin, Application, Window } from '../src/main';
import { delayPromise } from './delay-promise';

describe('Window.', function() {
    let fin: Fin;
    let testApp: Application;
    let testWindow: Window;

    const appConfigTemplate = {
        name: 'adapter-test-app-win-tests',
        url: 'about:blank',
        uuid: 'adapter-test-app-win-tests',
        autoShow: true,
        nonPersistent: true
    };

    // tslint:disable-next-line
    this.timeout(30000);

    before(() => {
        return conn().then(a => fin = a);
    });

    beforeEach(() => {
        return fin.Application.create(appConfigTemplate).then(a => {
            testApp = a;
            return testApp.run().then(() => testApp.getWindow().then(w => testWindow = w));
        });
    });

    afterEach(() => {
        return testApp.close();
    });

    describe('animate()', () => {
        it('Fulfilled', () => {
            const transitions = {
                opacity: {
                    opacity: 1,
                    duration: 100
                }
            };
            const options = {
                interrupt: true,
                tween: 'linear'
            };

            return testWindow.animate(transitions, options).then(() => assert(true));
        });
    });

    describe('getBounds()', () => {

        const bounds = {
            height: 400,
            width: 400,
            top: 10,
            left: 10
        };

        it('Fulfilled', () => testWindow.setBounds(bounds)
            .then(() => {
                return testWindow.getBounds().then(data => {
                    delete data.bottom;
                    delete data.right;
                    assert.deepEqual(bounds, data);
                });
            }));
    });

    describe('reload()', () => {

        it('Fulfilled', () => testWindow.reload().then(() => assert(true)));
    });

    describe('focus()', () => {

        it('Fulfilled', () => testWindow.focus().then(() => assert(true)));
    });

    describe('blur()', () => {

        it('Fulfilled', () => testWindow.blur().then(() => assert(true)));
    });

    describe('bringToFront()', () => {

        it('Fulfilled', () => testWindow.bringToFront().then(() => assert(true)));
    });

    describe('hide()', () => {

        it('Fulfilled', () => testWindow.hide().then(() => assert(true)));
    });

    describe('close()', () => {

        const appToCloseConfig = {
            name: 'adapter-test-app-to-close',
            url: 'about:blank',
            uuid: 'adapter-test-app-to-close',
            autoShow: true,
            nonPersistent: true
        };
        let appToClose: Application;
        let winToClose: Window;

        before(() => {
            return fin.Application.create(appToCloseConfig).then(a => {
                appToClose = a;
                return appToClose.run().then(() => appToClose.getWindow().then(w => winToClose = w));
            });
        });

        it('Fulfilled', () => winToClose.close().then(() => appToClose.isRunning()
            .then(data => assert(data === false))));
    });

    describe('getNativeId()', () => {

        it('Fulfilled', () => testWindow.getNativeId().then(data => assert(typeof (data) === 'string')));
    });

    describe('disableFrame()', () => {

        it('Fulfilled', () => testWindow.disableFrame().then(() => assert(true)));
    });

    describe('enableFrame()', () => {

        it('Fulfilled', () => testWindow.enableFrame().then(() => assert(true)));
    });

    describe('executeJavaScript()', () => {

        const scriptToExecute = 'console.log("hello world")';

        it('Descendant Window', () => testWindow.executeJavaScript(scriptToExecute)
            .then(() => {
                return assert(true);
            }));

        it('Non descendant Window', () => {
            return rawConnect({
                address: 'ws://localhost:9696',
                uuid: 'SECOND_CONECTION'
            }).then((otherFin) => {
                return otherFin.Window.wrap({
                    uuid: testWindow.identity.uuid,
                    name: testWindow.identity.uuid
                }).then(win => win.executeJavaScript(scriptToExecute)).catch(() => {
                    return assert(true);
                });
            });
        });
    });

    describe('flash()', () => {

        it('Fulfilled', () => testWindow.flash().then(() => assert(true)));
    });

    describe('getGroup()', () => {

        it('Fulfilled', () => testWindow.getGroup().then(data => assert(data instanceof Array,
            `Expected ${typeof (data)} to be an instance of Array`)));
    });

    describe('getOptions()', () => {

        it('Fulfilled', () => testWindow.getOptions().then(() => assert(true)));
    });

    describe('getInfo()', () => {

        it('Fulfilled', () => testWindow.getInfo().then(info => assert(typeof(info) === 'object')));
    });

    describe('getAllFrames()', () => {

        it('Fulfilled', () => testWindow.getAllFrames().then(framesInfo => assert(framesInfo instanceof Array)));
    });

    describe('getParentApplication()', () => {

        it('Fulfilled', () => testWindow.getParentApplication()
            .then(data => assert(data.identity.uuid === appConfigTemplate.uuid)));
    });

    describe('getParentWindow()', () => {

        it('Fulfilled', () => testWindow.getParentWindow().then(data => assert(data.identity.name === appConfigTemplate.uuid)));
    });

    //We need some real tests around this.
    // describe("getSnapshot()", () => {
    //      it("Fulfilled", () => testWindow.getSnapshot().then(() => assert(true)));
    // });

    describe('getState()', () => {

        it('Fulfilled', () => testWindow.getState().then(data => assert(typeof (data) === 'string')));
    });

    describe('isShowing()', () => {

        it('Fulfilled', () => testWindow.isShowing().then(data => assert(typeof (data) === 'boolean')));
    });

    //TODO: feature needs testing.
    // describe('joinGroup()', () => {

    //     it('Fulfilled', () => testWindow.joinGroup().should.eventually.be.Boolean());
    // });

    //TODO: feature needs testing.
    // describe('leaveGroup()', () => {

    //     it('Fulfilled', () => testWindow.leaveGroup().should.eventually.be.Boolean());
    // });

    describe('maximize()', () => {

        it('Fulfilled', () => testWindow.maximize().then(() => assert(true)));
    });

    //TODO: feature needs testing.
    // describe('mergeGroups()', () => {

    //     it('Fulfilled', () => testWindow.mergeGroups().should.eventually.be.Boolean());
    // });

    describe('minimize()', () => {

        it('Fulfilled', () => testWindow.minimize().then(() => testWindow.getState())
            .then(data => assert(data === 'minimized')));
    });

    describe('moveBy()', () => {

        it('Fulfilled', () => {

            return testWindow.getBounds().then(bounds => {

                return testWindow.moveBy(1, 1)
                    .then(() => testWindow.getBounds()
                        .then(data => {
                            return assert(data.top === bounds.top + 1, `Expected ${data.top} to be ${bounds.top + 1}`) &&
                                assert(data.left === bounds.left + 1, `Expected ${data.top} to be ${bounds.top + 1}`);
                        }));
            });

        });
    });

    describe('moveTo()', () => {

        it('Fulfilled', () => {

            return testWindow.moveTo(10, 10)
                .then(() => testWindow.getBounds()
                    .then(data => {
                        return assert(data.top === 10, `Expected ${data.top} to be 10`) &&
                            assert(data.left === 10, `Expected ${data.left} to be 10`);
                    }));
        });

    });

    describe('resizeBy()', () => {

        it('Fulfilled', () => {

            return testWindow.getBounds().then(bounds => {

                return testWindow.resizeBy(10, 10, 'top-left')
                    .then(() => testWindow.getBounds()
                        .then(data => {
                            data.bottom -= 10;
                            data.height -= 10;
                            data.right -= 10;
                            data.width -= 10;

                            assert.deepEqual(bounds, data);
                        }));
            });
        });
    });

    describe('resizeTo()', () => {

        it('Fulfilled', () => {

            return testWindow.getBounds().then(bounds => {

                return testWindow.resizeTo(10, 10, 'top-left')
                    .then(() => testWindow.getBounds()
                        .then(data => {
                            bounds.height = 10;
                            bounds.width = 10;
                            bounds.bottom = bounds.top + 10;
                            bounds.right = bounds.left + 10;
                            return assert.deepEqual(bounds, data);
                        }));
            });
        });
    });

    describe('setAsForeground()', () => {

        it('Fulfilled', () => testWindow.setAsForeground().then(() => assert(true)));
    });

    describe('setBounds()', () => {

        const bounds = {
            height: 400,
            width: 400,
            top: 10,
            left: 10,
            bottom: 410,
            right: 410
        };

        it('Fulfilled', () => testWindow.setBounds(bounds)
            .then(() => testWindow.getBounds()
                .then(data => {
                    return assert.deepEqual(bounds, data);
                })));
    });

    describe('show()', () => {

        it('Fulfilled', () => testWindow.show().then(() => assert(true)));
    });

    describe('showDeveloperTools()', () => {

        it('Fulfilled', async () => {
            return testWindow.showDeveloperTools().then(() => assert(true));
        });
    });

    describe('showAt()', () => {

        it('Fulfilled', () => {
            return testWindow.showAt(10, 10)
                .then(() => testWindow.getBounds()
                    .then(data => {
                        return assert(data.top === 10, `Expected ${data.top} to be 10`) &&
                            assert(data.left === 10, `Expected ${data.left} to be 10`);
                    }));
        });
    });

    describe('updateOptions()', () => {

        const updatedOptions = {
            height: 100
        };

        it('Fulfilled', () => testWindow.updateOptions(updatedOptions).then(() => assert(true)));
    });

    //TODO: feature needs testing.
    // describe('authenticate()', () => {

    //     it('Fulfilled', () => testWindow.authenticate(10, 10).should.be.fulfilled());
    // });

    describe('getZoomLevel()', () => {

        it('Fulfilled', () => testWindow.getZoomLevel().then(data => assert(data === 0)));
    });

    describe('setZoomLevel()', () => {

        const zoomLevel = 1;
        it('Fulfilled', async () => {

            await testWindow.setZoomLevel(zoomLevel);
            await delayPromise(100);
            const newZoomLevel = await testWindow.getZoomLevel();
            assert(newZoomLevel === zoomLevel);
        });
    });

    describe('navigate()', () => {
        it('Fulfilled', () => testWindow.navigate('https://www.google.com').then(() => assert(true)));
    });

    describe('navigateBack()', () => {

        it('Fulfilled', () => testWindow.navigateBack().then(() => assert(true)));
    });

    describe('stopNavigation()', () => {

        it('Fulfilled', () => testWindow.stopNavigation().then(() => assert(true)));
    });
});
