import { conn } from './connect';
import { Fin, Identity } from '../src/main';
import * as assert from 'assert';
import { cleanOpenRuntimes } from './multi-runtime-utils';
import { ExternalApplication } from '../src/api/external-application/external-application';

describe('ExternalApplication.', () => {
    let testExtAppIdentity: Identity;
    let fin: Fin;
    before(async () => {
        await cleanOpenRuntimes();
        fin = await conn();
        testExtAppIdentity = (await fin.System.getAllExternalApplications())[0];
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

    describe('wrapSync()', () => {
        it('exists', () => {
            assert(typeof fin.ExternalApplication.wrapSync === 'function');
        });

        it('should return ExternalApplication', () => {
            const returnVal = fin.ExternalApplication.wrapSync(testExtAppIdentity.uuid);
            assert(returnVal instanceof ExternalApplication);
        });

        it('should return ExternalApplication with matching identity', () => {
            const returnVal = fin.ExternalApplication.wrapSync(testExtAppIdentity.uuid);
            assert.deepEqual(returnVal.identity, testExtAppIdentity);
        });
    });
});
