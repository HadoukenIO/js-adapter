import { conn } from './connect';
import { Fin } from '../src/main';

describe('Plugin.', () => {
    let fin: Fin;

    before(() => {
        return conn().then((res) => fin = res);
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
