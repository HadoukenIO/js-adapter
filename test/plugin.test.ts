import { conn } from './connect';
import { Fin } from '../src/main';

describe('Plugin.', () => {
    let fin: Fin;
    const plugin = {
        name: 'plugin_1',
        version: '0.0.1'
    };

    before(() => {
        return conn().then((res) => fin = res);
    });

    describe('import()', () => {

        it('Doesn\'t work in Node environment', async () => {
            try {
                await fin.Plugin.import(plugin);
            } catch (error) {
                return true;
            }

            throw new Error('Expected to throw in Node');
        });

    });

});
