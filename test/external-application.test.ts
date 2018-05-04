import { conn } from './connect';
import { Fin } from '../src/main';
import * as assert from 'assert';
import { cleanOpenRuntimes } from './multi-runtime-utils';

describe('ExternalApplication.', () => {
    let fin: Fin;
    before(async () => {
        await cleanOpenRuntimes();
        fin = await conn();
    });

    describe('getInfo()', () => {
        it('Fulfilled', () => fin.System.getAllExternalApplications().
            then(apps => {
                const uuids = apps.map((app: any) => app.uuid);
                // get the uuid of first exteranl application to wrap if it exists
                fin.ExternalApplication.wrap(uuids[0] || 'notepad-uuid')
                .then(extApp => {
                    extApp.getInfo().then(info => {
                        assert(typeof(info) === 'object');
                    });
                });
        }));
    });
});
