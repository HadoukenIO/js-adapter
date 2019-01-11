import { launchAndConnect, testVersion, TEST_TIMEOUT, cleanOpenRuntimes, getRuntimeProcessInfo } from './multi-runtime-utils';
import * as assert from 'assert';
import { conn } from './connect';
import * as http from 'http';
import { Fin } from '../src/main';
/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code no-empty max-func-body-length */
let uuidCount = 0;
let realmCount = 0;
//tslint:disable-next-line
const manifest = {
    startup_app: { uuid: '', name: '' },
    runtime: { version: testVersion, securityRealm: '' }
};
let fin: Fin;
//tslint:disable-next-line\
const updateManifest = (uuid: string, realm = 'uuid-enforcement-realm-' + realmCount++) => {
   manifest.startup_app.uuid = uuid;
   manifest.startup_app.name = uuid;
   manifest.runtime.securityRealm = realm;
};
const server = http.createServer((req, res) => res.end(JSON.stringify(manifest)));
const serverReady = new Promise((y, n) => {
    server.listen(5000, e => e ? n(e) : y());
});
//tslint:disable-next-line
const newUuid = () => `duplicatedUuid${uuidCount++}`;

function makeTest<T>(func1: (uuid: string) => Promise<T>, func2: (uuid: string, ret?: T) => Promise<any>) {
    return async function () {
        const uuid = newUuid();
        const ret = await func1(uuid);
        try {
            await func2(uuid, ret);
        } catch (e) {
            console.error(e);
            assert.ok(true);
        }
    };
}
const createFromManifest = async (uuid: string) => {
    await serverReady;
    updateManifest(uuid);
    const app = await fin.Application.createFromManifest('http://localhost:5000');
    return app.run();
};
const create = async (uuid: string) => {
    const app = await fin.Application.create({uuid, name: uuid});
    return app.run();
};
const createFromManifestIntoRealm = async (uuid: string, fin2: Fin) => {
    const realm = getRuntimeProcessInfo(fin2).realm;
    await serverReady;
    updateManifest(uuid, realm);
    const app = await fin.Application.createFromManifest('http://localhost:5000');
    return app.run();
};
const externalConnection = (uuid: string) => launchAndConnect(testVersion, uuid);

describe('UUID Enforcement', async function () {
    this.retries(2);
    this.slow(TEST_TIMEOUT);
    this.timeout(TEST_TIMEOUT);

    before(async () => {
        fin = await conn();
    });

    beforeEach(async function () {
        return await cleanOpenRuntimes();
    });
    after(() => server.close());
    it('1. External connection 2. External connection', makeTest(externalConnection, externalConnection));
    it('1. External connection 2. Start up(create from manifest)', makeTest(externalConnection, createFromManifest));
    it('1. External connection 2. Create from manifest into existing runtime', makeTest(externalConnection, createFromManifestIntoRealm));
    it('1. External connection 2. API create call (diff runtime)', makeTest(externalConnection, create));
    it('1. Start up(create from manifest) 2. External connection', makeTest(createFromManifest, externalConnection));
    it('1. API create call 2. External connection', makeTest(create, externalConnection));
});
