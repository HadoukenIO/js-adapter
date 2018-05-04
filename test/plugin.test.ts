import { conn } from './connect';
import { Fin } from '../src/main';
import { cleanOpenRuntimes } from './multi-runtime-utils';

describe('Plugin.', () => {
    let fin: Fin;

    before(async () => {
        await cleanOpenRuntimes();
        fin = await conn();
    });

    describe('import()', () => {

        it('Doesn\'t work in Node environment', async () => {
            try {
                await fin.Plugin.import('plugin_1');
            } catch (error) {
                return true;
            }

            throw new Error('Expected to throw in Node');
        });

    });

});
