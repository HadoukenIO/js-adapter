import { conn } from './connect';
import { Fin } from '../src/main';
import * as assert from 'assert';

describe('ExternalApplication.', () => {
    let fin: Fin;
    before(() => conn().then((a: Fin) => fin = a));

    describe('getInfo()', () => {

        it('Should contain parent information', () => fin.ExternalApplication.wrap('notepad-uuid')
            .then(extApp => {
                return extApp.getInfo().then(info => {
                    // todo: need to get parent uuid and name info
                    return assert(info.parent === null);
                });
        }));
    });
});
