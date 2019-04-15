import * as sinon from 'sinon';
import { conn } from './connect';
import { delayPromise } from './delay-promise';
import * as assert from 'assert';
import { Fin } from '../src/main';
import { _Window } from '../src/api/window/window';
import { Application } from '../src/api/application/application';
import { cleanOpenRuntimes } from './multi-runtime-utils';

// tslint:disable-next-line:no-function-expression
describe('Window.', function() {

    let fin: Fin;
    let app: Application;
    let win: _Window;

    const appConfigTemplate = {
        name: 'adapter-test-app-win-events',
        url: 'about:blank',
        uuid: 'adapter-test-app-win-events',
        autoShow: true,
        saveWindowState: false,
        accelerator: {
            devtools: true
        },
        opacity: 1
    };

    // tslint:disable-next-line
    this.timeout(30000);

    before(async () => {
        await cleanOpenRuntimes();
        fin = await conn();
    });

    beforeEach(async () => {
        app = await fin.Application.create(appConfigTemplate);
        await app.run();
        win = await app.getWindow();
    });

    afterEach(async() => {
        await app.close();
    });

    describe('"closed"', () => {

        it('called', () => {
            const spy = sinon.spy();

            win.on('closed', spy);

            return win.close()
                .then(() => delayPromise())
                .then(() => assert(spy.calledOnce));
        });
    });

    describe('"options-changed"', () => {

        it('called with payload', () => {
            const optionName = 'opacity';
            const spy = sinon.spy();
            win.on('options-changed', spy);

            const optionToUpdate = {
                [optionName]: 0
            };

            const expectedDiffObject = {
                oldVal: 1,
                newVal: 0
            };

            return win.updateOptions(optionToUpdate)
                .then(() => delayPromise())
                .then(() => spy.args[0][0])
                .then(payload => assert.deepEqual(payload.diff[optionName], expectedDiffObject));
        });
    });
});
