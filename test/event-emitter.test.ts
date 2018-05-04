import * as assert from 'assert';
import { conn } from './connect';
import { Fin } from '../src/main';
import * as sinon from 'sinon';
import { cleanOpenRuntimes } from './multi-runtime-utils';

describe ('Event Emitter Methods', () => {
    let fin: Fin;
    let app: any;
    let win: any;
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
            const eventNames = win.eventNames();
            await win.close();
            assert(eventNames.length === 1, `Expected ${eventNames} to be closed and only closed`);
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
            const noEvents = win.eventNames();
            await win.moveBy(1, 1);
            await win.on('bounds-changed', boundsSpy);
            const eventNames = win.eventNames();
            await win.moveBy(1, 1);
            await win.close();
            assert(boundsSpy.calledTwice);
            assert(closedSpy.notCalled);
            assert(eventNames.length === 1, `Expected ${eventNames} to be bounds-changed and only bounds-changed`);
            assert(noEvents.length === 0, `Expected ${eventNames} event to not exist`);
        });
    });

});
