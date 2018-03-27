import { conn } from './connect';
import * as assert from 'assert';
import { Fin, Notification } from '../src/main';

// tslint:disable-next-line
describe('Notification', function () {
    let fin: Fin;
    let notification: Notification;
    // tslint:disable-next-line
    this.timeout(30000);
    before(() => {
        return conn().then(_fin => {
            fin = _fin;
            notification = fin.Notification.create({url: 'http://openfin.co'});
        });
    });

    describe('shape - instance', () => {
        it('should have a sendMessage method', () => {
            assert(typeof (notification.sendMessage) === 'function');
        });

        it('should have a close method', () => {
            assert(typeof (notification.close) === 'function');
        });
    });

});
