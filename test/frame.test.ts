import { conn } from './connect';
import * as assert from 'assert';
import { Fin, Application, Frame } from '../src/main';

describe('Frame.', () => {
    let fin: Fin;
    let testApp: Application;
    let testFrame: Frame;

    const appConfigTemplate = {
        name: 'adapter-test-app-frm-tests',
        url: 'about:blank',
        uuid: 'adapter-test-app-frm-tests',
        autoShow: true,
        nonPersistent: true
    };

    before(() => {
        return conn().then(a => fin = a);
    });

    beforeEach(() => {
        return fin.Application.create(appConfigTemplate).then(a => {
            testApp = a;
            return testApp.run().then(() => fin.Frame.getCurrent().then(f => testFrame = f));
        });
    });

    afterEach(() => {
        return testApp.close();
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
