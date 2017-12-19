import { conn } from './connect';
import * as assert from 'assert';
import { Fin, Frame } from '../src/main';

describe('Frame.', () => {
    let fin: Fin;
    let testFrame: Frame;

    before(() => {
        return conn().then(a => fin = a);
    });

    beforeEach(() => {
        return fin.Frame.getCurrent().then(f => testFrame = f);
    });

    describe('getInfo()', () => {

        it('Fulfilled', () => testFrame.getInfo().then(info => {
            assert(typeof(info) === 'object');
        }));
    });

    /*
    describe('getParentWindow()', () => {
        // core has to check if app exists or not
        it('Fulfilled', () => testFrame.getParentWindow().then(winInfo => assert(typeof(winInfo) === 'object')));
    });
    */
});
