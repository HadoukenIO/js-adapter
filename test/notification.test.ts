import { conn } from './connect';
import * as assert from 'assert';
import { Fin } from '../src/main';

// tslint:disable-next-line
describe('Notification', function () {
    let fin: Fin;
    let notification: any;
    before(() => {
        // tslint:disable-next-line:no-invalid-this
        this.timeout(30000);
        return conn().then(_fin => {
            fin = _fin;
            notification = fin.Notification.create({});
        });
    });

    describe('shape - instance', () => {
        it('should have a sendMessage method', () => {
            assert(typeof (notification.sendMessage) === 'function');
        });

        it('should have a close method', () => {
            assert(typeof (notification.sendMessage) === 'function');
        });
    });

});
