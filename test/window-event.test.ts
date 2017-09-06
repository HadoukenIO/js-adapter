import * as sinon from 'sinon';
import { conn } from './connect';
import { delayPromise } from './delay-promise';
import * as assert from 'assert';
import { Fin } from '../src/main';

describe('Window.', () => {
    describe('addEventListener()', () => {
        let fin: Fin;

        const appConfigTemplate = {
            name: 'adapter-test-app',
            url: 'about:blank',
            uuid: 'adapter-test-app',
            autoShow: true,
            accelerator: {
                devtools: true
            }
        };

        before(() => {
            return conn().then(a => fin = a);
        });

        describe('"closed"', () => {

            before(() => fin.Application.create(appConfigTemplate).then(app => app.run()));

            it('called', () => {
                const spy = sinon.spy();

                return fin.Application.wrap({ uuid: 'adapter-test-app' }).getWindow().then(win => {

                    win.on('closed', spy);

                    return win.close()
                        .then(() => delayPromise())
                        .then(() => assert(spy.calledOnce));
                });
            });
        });

    });
});
