import * as assert from 'assert';
import { conn } from './connect';
import { Fin } from '../src/main';
// import * as sinon from 'sinon';
import { cleanOpenRuntimes } from './multi-runtime-utils';

describe ('tommy', () => {
    let fin: Fin;
    let app: any;
    let win: any;
    const appConfigTemplate = {
        name: 'adapter-test-app',
        url: 'about:blank',
        uuid: 'adapter-test-app',
        autoShow: true,
        saveWindowState: false,
        accelerator: {
            devtools: true
        }
    };

    before(() => {
        return conn().then(async a => {
            fin = a;
            await cleanOpenRuntimes();
        });
    });

    beforeEach(async () => {
        app = await fin.Application.create(appConfigTemplate);
        await app.run();
        win = await app.getWindow();
    });

    afterEach(async() => {
        await app.close();
    });

    describe('External Services',  () => {
        it('Should be able to connect as Provider', async () => {
            const provider = await fin.Service.register();
            assert(provider);
        });
    });
});