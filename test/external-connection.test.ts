/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code */
import { conn } from './connect';
import * as assert from 'assert';
import { Fin, connect as rawConnect, Identity } from '../src/main';
import { cleanOpenRuntimes } from './multi-runtime-utils';

describe('External Connection', function() {
    let fin: Fin;
    let fin2: Fin;
    let incrementer = 0;
    let channelName: string;
    let externalConnectionIdentity: Identity;

    before(async () => {
        fin = await conn();
        fin2 = await rawConnect({
            address: 'ws://localhost:9696',
            uuid: 'externalConnectionUUID'
        });
        externalConnectionIdentity = fin2.me;
    });

    beforeEach(async () => {
        incrementer = incrementer + 1;
        channelName = `test-channel-${incrementer}`;
        await cleanOpenRuntimes();
    });

    it('should be able to dispatch messages to an external connection', async() => {
        const channelProvider = await fin.InterApplicationBus.Channel.create(channelName);
        const channelClient = await fin2.InterApplicationBus.Channel.connect(channelName);

        await channelClient.register('test-topic', (payload: string) => {
            assert.equal(payload, 'test-payload-string');
        });

        await channelProvider.dispatch(externalConnectionIdentity, 'test-topic', 'test-payload-string');
    });

    it('should be able to publish messages to an external connection', async() => {
        const channelProvider = await fin.InterApplicationBus.Channel.create(channelName);
        const channelClient = await fin2.InterApplicationBus.Channel.connect(channelName);

        await channelClient.register('test-topic', (payload: string) => {
            assert.equal(payload, 'test-payload-string');
        });

        await channelProvider.publish('test-topic', 'test-payload-string');
    });

    it('should be able to disconnect from a provider', async() => {
        const channelProvider = await fin.InterApplicationBus.Channel.create(channelName);
        const channelClient = await fin2.InterApplicationBus.Channel.connect(channelName);

        channelProvider.onDisconnection((identity) => {
            assert.equal(identity.uuid, externalConnectionIdentity.uuid);
            assert.equal(identity.name, externalConnectionIdentity.uuid);
        });

        await channelClient.disconnect();
    });

    it('should use an external connection\'s provided nameAlias', async() => {
        const nameAlias = 'nameAlias1';

        const channelProvider = await fin.InterApplicationBus.Channel.create(channelName);
        channelProvider.onConnection((connectionPayload) => {
            assert.equal(connectionPayload.name, nameAlias);
        });

        await fin2.InterApplicationBus.Channel.connect(channelName, {payload: {nameAlias}});
    });

    it('should be able to disconnect from a provider when using a nameAlias', async() => {
        const nameAlias = 'nameAlias2';
        const channelProvider = await fin.InterApplicationBus.Channel.create(channelName);
        const channelClient = await fin2.InterApplicationBus.Channel.connect(channelName, {payload: {nameAlias}});

        channelProvider.onDisconnection((disconnectionPayload) => {
            assert.equal(disconnectionPayload.uuid, externalConnectionIdentity.uuid);
            assert.equal(disconnectionPayload.name, nameAlias);
        });

        await channelClient.disconnect();
    });
});
