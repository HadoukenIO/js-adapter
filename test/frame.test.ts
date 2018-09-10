import { conn } from './connect';
import * as assert from 'assert';
import { Fin, Frame } from '../src/main';
import { cleanOpenRuntimes } from './multi-runtime-utils';
import { _Frame } from '../src/api/frame/frame';

describe('Frame.', () => {
    let fin: Fin;
    let testFrame: Frame;

    before(async () => {
        await cleanOpenRuntimes();
        fin = await conn();
    });

    beforeEach(() => {
        return fin.Frame.getCurrent().then(f => testFrame = f);
    });

    describe('getInfo()', () => {

        it('Fulfilled', () => testFrame.getInfo().then(info => {
            assert(typeof(info) === 'object');
        }));
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

        it('should return Frame', () => {
            const returnVal = fin.Frame.getCurrentSync();
            assert(returnVal instanceof _Frame);
        });
    });

    /*
    describe('getParentWindow()', () => {
        // core has to check if app exists or not
        it('Fulfilled', () => testFrame.getParentWindow().then(winInfo => assert(typeof(winInfo) === 'object')));
    });
    */
});
