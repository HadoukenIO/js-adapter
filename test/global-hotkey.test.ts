/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code */
import { conn } from './connect';
import * as assert from 'assert';
import { Fin } from '../src/main';
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

    it('Should register successfully', async() => {
        const spy = sinon.spy();
        await fin.GlobalHotkey.register(hotkey, () => spy);
        assert.ok(true);
    });
});
