import * as assert from 'assert';
import { launchAndConnect, cleanOpenRuntimes } from './multi-runtime-utils';

describe('Multi Runtime', function() {

    // tslint:disable-next-line no-function-expression
    afterEach(function(done: Function) {
        cleanOpenRuntimes().then(() => done());
    });

    describe('InterApplicationBus', () => {
        it('should subscribe to * and publish', function(done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(120000);

            Promise.all([launchAndConnect(), launchAndConnect()]).then((conns: any) => {
                setTimeout(() => {
                    const r1 = conns[0];
                    const r2 = conns[1];

                    r1.fin.InterApplicationBus.subscribe({ uuid: '*' }, 'my-topic', () => done()).then(() => {
                        r2.fin.InterApplicationBus.publish('my-topic', 'hello');
                    });
                }, 5000);
            });
        });

        it('should subscribe to a uuid and publish', function(done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(120000);

            Promise.all([launchAndConnect(), launchAndConnect()]).then((conns: any) => {
                setTimeout(() => {
                    const r1 = conns[0];
                    const r2 = conns[1];
                    r1.fin.InterApplicationBus.subscribe({ uuid: r2.fin.wire.me.uuid }, 'my-topic', () => {
                        done();
                    }).then(() => {
                        r2.fin.InterApplicationBus.publish('my-topic', 'hello');
                    });
                }, 5000);
            });
        });

        it('should subscribe to * and send', function(done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(120000);

            Promise.all([launchAndConnect(), launchAndConnect()]).then((conns: any) => {
                setTimeout(() => {
                    const r1 = conns[0];
                    const r2 = conns[1];

                    r1.fin.InterApplicationBus.subscribe({ uuid: '*' }, 'my-topic', () => done()).then(() => {
                        r2.fin.InterApplicationBus.send({ uuid: r1.fin.wire.me.uuid }, 'my-topic', 'hello');
                    });
                }, 5000);
            });
        });

        it('should subscribe to uuid and send', function(done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(120000);

            Promise.all([launchAndConnect(), launchAndConnect()]).then((conns: any) => {
                setTimeout(() => {
                    const r1 = conns[0];
                    const r2 = conns[1];

                    r1.fin.InterApplicationBus.subscribe({ uuid: r2.fin.wire.me.uuid }, 'my-topic', () => done()).then(() => {
                        r2.fin.InterApplicationBus.send({ uuid: r1.fin.wire.me.uuid }, 'my-topic', 'hello');
                    });
                }, 5000);
            });
        });

        it('should get subscriberAdded Events', function(done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(120000);

            Promise.all([launchAndConnect(), launchAndConnect()]).then((conns: any) => {
                setTimeout(() => {
                    const r1 = conns[0];
                    const r2 = conns[1];
                    const expectedUuid = r2.fin.wire.me.uuid;
                    const topic = 'my-topic';

                    r1.fin.InterApplicationBus.on('subscriber-added', (sub: any, b: any) => {
                        assert.equal(expectedUuid, sub.uuid, 'Expected UUIDs to match');
                        assert.equal(sub.topic, topic, 'Expected topics to match');
                        done();
                    });

                    setTimeout(() => {
                        // tslint:disable-next-line
                        r2.fin.InterApplicationBus.subscribe({ uuid: r1.fin.wire.me.uuid }, 'my-topic', () => {});
                    }, 300);
                }, 5000);
            });
        });

        it('should get subscriberRemoved Events', function(done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(120000);

            Promise.all([launchAndConnect(), launchAndConnect()]).then((conns: any) => {
                setTimeout(() => {
                    const r1 = conns[0];
                    const r2 = conns[1];
                    const expectedUuid = r2.fin.wire.me.uuid;
                    const topic = 'my-topic';

                    r1.fin.InterApplicationBus.on('subscriber-removed', (sub: any, b: any) => {
                        assert.equal(expectedUuid, sub.uuid, 'Expected UUIDs to match');
                        assert.equal(sub.topic, topic, 'Expected topics to match');
                        done();
                    });

                    setTimeout(() => {
                        // tslint:disable-next-line
                        function listener() {};
                        r2.fin.InterApplicationBus.subscribe({ uuid: r1.fin.wire.me.uuid }, 'my-topic', listener).then(() => {
                            r2.fin.InterApplicationBus.unsubscribe({ uuid: r1.fin.wire.me.uuid }, 'my-topic', listener);
                        });
                    }, 300);
                }, 5000);
            });
        });
    });

});
