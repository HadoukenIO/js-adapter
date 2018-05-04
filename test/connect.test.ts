import { conn } from './connect';
import * as assert from 'assert';
import { connect as rawConnect, Fin } from '../src/main';
import { cleanOpenRuntimes } from './multi-runtime-utils';

describe('connect()', () => {
    let fin: Fin;
    before(async () => {
        await cleanOpenRuntimes();
        fin = await conn();
    });
    it('authentication', () => {
        assert(fin.System !== undefined);
    });

    it('should fail if given duplicate UUIDs', () => {
        const connOptions = {
            address: 'ws://localhost:9696',
            uuid: 'CONECTION_DUP_TEST'
        };

        return rawConnect(connOptions).then(() => {
            return rawConnect(connOptions).catch(err => {
                assert(err.message === `Application with specified UUID already exists: ${connOptions.uuid}`);
            });
        });

    });
});
