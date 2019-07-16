import { conn } from './connect';
import * as assert from 'assert';
import { Fin, Application } from '../src/main';
import { cleanOpenRuntimes } from './multi-runtime-utils';
import { _Frame } from '../src/api/frame/frame';
import * as path from 'path';

describe('Frame.', () => {
    let fin: Fin;
    let testFrame: _Frame;
    let testApp: Application;
    let counter: number = 0;

    before(async () => {
        await cleanOpenRuntimes();
        fin = await conn();
    });

    beforeEach(async () => {
        testApp = await fin.Application.start({
            name: `adapter-test-app-frame-${counter}`,
            url: path.resolve('test/assets/frame.html'),
            // tslint:disable-next-line
            uuid: `adapter-test-app-frame-${counter++}`,
            accelerator: {
                devtools: true
            }
        });
        const win = await fin.Window.wrap({ ...testApp.identity, name: testApp.identity.uuid });
        const frameIdentity = (await win.getAllFrames()).filter(frame => frame.entityType === 'iframe')[0];
        testFrame = fin.Frame.wrapSync(frameIdentity);
    });
    afterEach(() => testApp.close());

    describe('getInfo()', () => {
        it('Fulfilled', async () => {
            const info = await testFrame.getInfo();
            assert(typeof (info) === 'object');
        });
    });

    describe('wrapSync()', () => {
        it('exists', () => {
            assert(typeof fin.Frame.wrapSync === 'function');
        });

        it('should return _Frame', () => {
            const returnVal = fin.Frame.wrapSync(testFrame.identity);
            assert(returnVal instanceof _Frame);
        });

        it('should return _Frame with matching identity', () => {
            const returnVal = fin.Frame.wrapSync(testFrame.identity);
            assert.deepEqual(returnVal.identity, testFrame.identity);
        });
    });

    describe('getCurrentSync()', () => {
        it('exists', () => {
            assert(typeof fin.Frame.getCurrentSync === 'function');
        });
    });
});
