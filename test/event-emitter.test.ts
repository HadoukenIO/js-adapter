import * as assert from 'assert';
import { conn } from './connect';
import { Fin } from '../src/main';
import { _Window } from '../src/api/window/window';
import { Application } from '../src/api/application/application';
import * as sinon from 'sinon';
import { cleanOpenRuntimes } from './multi-runtime-utils';

describe ('Event Emitter Methods', () => {
    let fin: Fin;
    let app: Application;
    let win: _Window;
    const appConfigTemplate = {
        name: 'adapter-test-app',
        url: 'about:blank',
        uuid: 'adapter-test-app',
        autoShow: true,
        saveWindowState: false,
        accelerator: {
            devtools: true
        }
    };

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

    describe('once', () => {
        it('should only get called once then removed', async () => {
            const spy = sinon.spy();
            await win.once('bounds-changed', spy);
            await win.moveBy(1, 1);
            await win.moveBy(1, 1);
            assert(spy.calledOnce);
        });
    });

    describe('removeAllListeners', () => {
        it('should remove listeners for a given event', async () => {
            const boundsSpy = sinon.spy();
            const closedSpy = sinon.spy();
            await win.addListener('bounds-changed', boundsSpy);
            await win.addListener('closed', closedSpy);
            await win.moveBy(1, 1);
            await win.removeAllListeners('bounds-changed');
            await win.moveBy(1, 1);
            const boundsChangedCount = win.listenerCount('bounds-changed');
            await win.close();
            assert(boundsChangedCount === 0, 'Expected bounds-changed to be removed');
            assert(boundsSpy.calledOnce);
            assert(closedSpy.calledOnce);
        });

        it('should remove listeners for all events', async () => {
            const boundsSpy = sinon.spy();
            const closedSpy = sinon.spy();
            await win.addListener('bounds-changed', boundsSpy);
            await win.on('closed', closedSpy);
            await win.moveBy(1, 1);
            await win.removeAllListeners();
            const noEvents = win.listenerCount('bounds-changed') + win.listenerCount('closed');
            await win.moveBy(1, 1);
            await win.on('bounds-changed', boundsSpy);
            const oneEvent = win.listenerCount('bounds-changed');
            await win.moveBy(1, 1);
            await win.close();
            assert(boundsSpy.calledTwice);
            assert(closedSpy.notCalled);
            assert(oneEvent === 1, 'Expected bounds-changed to be bounds-changed and only bounds-changed');
            assert(noEvents === 0, 'Expected bounds-changed event to not exist');
        });
    });

});
