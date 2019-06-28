/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code */
import { conn } from './connect';
import * as assert from 'assert';
import { Fin, connect as rawConnect } from '../src/main';
import { cleanOpenRuntimes } from './multi-runtime-utils';

describe('External Connection', function() {
    let fin: Fin;

    before(async () => {
        await cleanOpenRuntimes();
        fin = await conn();
    });

    it('should use an external connection\'s provided nameAlias', async() => {
        const fin2 = await rawConnect({
            address: 'ws://localhost:9696',
            uuid: 'nameAliasUUID'
        });

        const nameAlias = 'nameAlias';

        const channelProvider = await fin.InterApplicationBus.Channel.create('test-channel');
        channelProvider.onConnection((connectionPayload) => {
            assert.equal(connectionPayload.name, nameAlias);
        });

        await fin2.InterApplicationBus.Channel.connect('test-channel', {payload: {nameAlias}});
    });
});
