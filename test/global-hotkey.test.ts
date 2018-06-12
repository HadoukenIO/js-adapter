/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code */
import { conn } from './connect';
import * as assert from 'assert';
import { Fin, connect as rawConnect } from '../src/main';
import { cleanOpenRuntimes } from './multi-runtime-utils';

// tslint:disable-next-line
const sinon = require('sinon');

describe('GlobalHotkey.', function() {
    let fin: Fin;
    const hotkey = 'CommandOrControl+X';

    before(async () => {
        await cleanOpenRuntimes();
        fin = await conn();
    });

    beforeEach(async () => {
        await fin.GlobalHotkey.unregisterAll();
    });

    it('should detect if a hotkey is registered', async() => {
        const spy = sinon.spy();
        const expectFalse = await fin.GlobalHotkey.isRegistered(hotkey);

        assert.deepStrictEqual(expectFalse, false, 'Expected hotkey not to be registered');
        await fin.GlobalHotkey.register(hotkey, spy);
        const expectTrue = await fin.GlobalHotkey.isRegistered(hotkey);

        assert.deepStrictEqual(expectTrue, true, 'Expected hotkey to be registered');
    });

    it('should unregister a hotkey', async() => {
        const spy = sinon.spy();
        await fin.GlobalHotkey.register(hotkey, spy);
        const expectTrue = await fin.GlobalHotkey.isRegistered(hotkey);

        assert.deepStrictEqual(expectTrue, true, 'Expected hotkey to be registered');

        await fin.GlobalHotkey.unregister(hotkey);
        const expectFalse = await fin.GlobalHotkey.isRegistered(hotkey);

        assert.deepStrictEqual(expectFalse, false, 'Expected hotkey not to be registered');
    });

    it('should register multiple hotkeys', async() => {
        const spy = sinon.spy();
        const hotkey2 = 'CommandOrControl+Y';
        await fin.GlobalHotkey.register(hotkey2, spy);
        await fin.GlobalHotkey.register(hotkey, spy);
        const expectTrue = await fin.GlobalHotkey.isRegistered(hotkey);
        const expectTrue2 = await fin.GlobalHotkey.isRegistered(hotkey2);

        assert.deepStrictEqual(expectTrue, true, 'Expected hotkey to be registered');
        assert.deepStrictEqual(expectTrue2, true, 'Expected hotkey to be registered');
        await fin.GlobalHotkey.unregisterAll();
    });

    it('should unregister only specified hotkeys', async() => {
        const spy = sinon.spy();
        const hotkey2 = 'CommandOrControl+Y';
        await fin.GlobalHotkey.register(hotkey2, spy);
        await fin.GlobalHotkey.register(hotkey, spy);

        await fin.GlobalHotkey.unregister(hotkey2);
        const expectTrue = await fin.GlobalHotkey.isRegistered(hotkey);
        const expectFalse = await fin.GlobalHotkey.isRegistered(hotkey2);

        assert.deepStrictEqual(expectFalse, false, 'Expected hotkey not to be registered');
        assert.deepStrictEqual(expectTrue, true, 'Expected hotkey to be registered');
        await fin.GlobalHotkey.unregisterAll();
    });

    it('should unregister all hotkeys', async() => {
        const spy = sinon.spy();
        const hotkey2 = 'CommandOrControl+Y';
        await fin.GlobalHotkey.register(hotkey2, spy);
        await fin.GlobalHotkey.register(hotkey, spy);

        await fin.GlobalHotkey.unregisterAll();
        const expectFalse = await fin.GlobalHotkey.isRegistered(hotkey);
        const expectFalse2 = await fin.GlobalHotkey.isRegistered(hotkey2);

        assert.deepStrictEqual(expectFalse, false, 'Expected hotkey not to be registered');
        assert.deepStrictEqual(expectFalse2, false, 'Expected hotkey not to be registered');

    });

    it('should raise registered events', function(done: any) {
        async function test() {
            const spy = sinon.spy();
            await fin.GlobalHotkey.on('registered', async (evt) => {
                assert.deepStrictEqual(evt.hotkey, hotkey, 'Expected hotkey from event to match');
                await fin.GlobalHotkey.removeAllListeners('registered');
                done();
            });
            await fin.GlobalHotkey.register(hotkey, spy);
        }

        test();
    });

    it('should raise unregistered events', function(done: any) {
        async function test() {
            const spy = sinon.spy();
            await fin.GlobalHotkey.on('unregistered', async (evt) => {
                assert.deepStrictEqual(evt.hotkey, hotkey, 'Expected hotkey from event to match');
                await fin.GlobalHotkey.removeAllListeners('unregistered');
                done();
            });
            await fin.GlobalHotkey.register(hotkey, spy);
            await fin.GlobalHotkey.unregister(hotkey);
        }

        test();
    });

    it('should fail to register a reserved hotkey', async() => {
        const spy = sinon.spy();
        const reservedHotkey = 'CommandOrControl+Plus';
        try {
            await fin.GlobalHotkey.register(reservedHotkey, spy);
        } catch (err) {
            assert.ok(err instanceof Error, 'Expected error thrown to be an instance of Error');
            assert.equal(err.message, 'Error: Failed to register Hotkey: CommandOrControl+Plus, is reserved');
        }
    });

    it('should allow multiple registrations from the same connection', async() => {
        const spy = sinon.spy();
        const spy2 = sinon.spy();

        await fin.GlobalHotkey.register(hotkey, spy);
        await fin.GlobalHotkey.register(hotkey, spy2);
        const expectTrue = await fin.GlobalHotkey.isRegistered(hotkey);

        assert.deepStrictEqual(expectTrue, true, 'Expected hotkey to be registered');
    });

    it('should fail to register a hotkey if it owned by a different uuid', async() => {
        const spy = sinon.spy();
        const spy2 = sinon.spy();

        const fin2 = await rawConnect({
            address: 'ws://localhost:9696',
            uuid: 'second_uuid'
        });

        await fin.GlobalHotkey.register(hotkey, spy);
        try {
            await fin2.GlobalHotkey.register(hotkey, spy2);
        } catch (err) {
            assert.ok(err instanceof Error, 'Expected error thrown to be an instance of Error');
            assert.equal(err.message, 'Error: Failed to register Hotkey: CommandOrControl+X, already registered');
        }
    });

    it('should raise unregister as we unregister all hotkeys', async() => {
        const spy = sinon.spy();
        const spy2 = sinon.spy();
        await fin.GlobalHotkey.on('unregistered', spy2);
        await fin.GlobalHotkey.register(hotkey, spy);
        await fin.GlobalHotkey.unregisterAll();

        assert.ok(spy2.calledOnce, 'Expected the unregistered event to be called at least once');
    });

    it('should raise register after we unregister all hotkeys',  function(done: any) {
        async function test() {
            const spy = sinon.spy();
            const spy2 = sinon.spy();

            await fin.GlobalHotkey.register(hotkey, spy);
            await fin.GlobalHotkey.on('registered',  async (evt) => {
                assert.deepStrictEqual(evt.hotkey, hotkey, 'Expected hotkey from event to match');
                await fin.GlobalHotkey.removeAllListeners('unregistered');
                done();
            });
            await fin.GlobalHotkey.unregisterAll();
            await fin.GlobalHotkey.register(hotkey, spy2);
        }

        test();
    });
});
