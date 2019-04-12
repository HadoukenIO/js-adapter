import { launchAndConnect, testVersion, TEST_TIMEOUT, cleanOpenRuntimes, getRuntimeProcessInfo, getPort } from './multi-runtime-utils';
import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { conn } from './connect';
import { Fin, connect, Application } from '../src/main';
/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code no-empty max-func-body-length */
let uuidCount = 0;
let realmCount = 0;

const manifestPath = path.resolve('test/uuid-enforcement-app.json');
//tslint:disable-next-line
const manifest = {
    startup_app: { uuid: '', name: '' },
    runtime: { version: testVersion, securityRealm: '' }
};
let fin: Fin;
//tslint:disable-next-line
const updateManifest = (uuid: string, realm = 'uuid-enforcement-realm-' + realmCount++) => {
   manifest.startup_app.uuid = uuid;
   manifest.startup_app.name = uuid;
   manifest.runtime.securityRealm = realm;
   fs.writeFileSync(manifestPath, JSON.stringify(manifest));
};
//tslint:disable-next-line
const newUuid = () => `duplicatedUuid${uuidCount++}`;

let runningApps: Application[] = [];

async function cleanupRunningApps() {
    await Promise.all(runningApps.map(app => app.quit()));
    runningApps = [];
    return;
}

function makeTest<T>(func1: (uuid: string) => Promise<T>, func2: (uuid: string, ret?: T) => Promise<any>) {
    return async function () {
        const uuid = newUuid();
        const ret = await func1(uuid);
        let secondFailed = false;
        try {
            await func2(uuid, ret);
        } catch (e) {
            secondFailed = true;
        }
        assert.ok(secondFailed);
        return { uuid, ret };
    };
}
const startFromManifest = async (uuid: string) => {
    updateManifest(uuid);
    const app = await fin.Application.startFromManifest(manifestPath);
    return runningApps.push(app);
};
const create = async (uuid: string) => {
    const app = await fin.Application.start({uuid, name: uuid});
    return runningApps.push(app);
};
const startFromManifestIntoRealm = async (uuid: string, fin2: Fin) => {
    const realm = getRuntimeProcessInfo(fin2).realm;
    updateManifest(uuid, realm);
    const app = await fin.Application.startFromManifest(manifestPath);
    return runningApps.push(app);
};
const externalConnection = (uuid: string) => launchAndConnect(testVersion, uuid);

describe('UUID Enforcement', async function () {
    this.slow(TEST_TIMEOUT);
    this.timeout(TEST_TIMEOUT);

    before(async () => {
        fin = await conn();
        fs.writeFileSync(manifestPath, JSON.stringify(manifest));
    });

    afterEach(async function () {
        await cleanupRunningApps();
        return await cleanOpenRuntimes();
    });

    after(() => {
        fs.unlinkSync(manifestPath);
    });

    it('1. External connection 2. External connection', makeTest(externalConnection, externalConnection));
    it('1. External connection 2. Start up(create from manifest)', makeTest(externalConnection, startFromManifest));
    it('1. External connection 2. Create from manifest into existing runtime', makeTest(externalConnection, startFromManifestIntoRealm));
    it('1. External connection 2. API create call (diff runtime)', makeTest(externalConnection, create));
    it('1. Start up(create from manifest) 2. External connection', makeTest(startFromManifest, externalConnection));
    it('1. API create call 2. External connection', makeTest(create, externalConnection));
    it('Releases uuid on disconnect from the same realm', async function() {
        const realmId = newUuid();
        // tslint:disable-next-line
        const persistentRuntime = await launchAndConnect(testVersion, newUuid(), realmId);
        const dupeUuid = newUuid();
        const port = getPort(persistentRuntime);
        const runtime1 = await connect({
            address: `ws://localhost:${port}`,
            uuid: dupeUuid
        });
        let failedFirstTry = false;
        try {
            await externalConnection(dupeUuid);
        } catch (e) {
            failedFirstTry = true;
        }
        // @ts-ignore - wire is private
        await runtime1.wire.wire.shutdown();
        let failedSecondTry = false;
        try {
            await externalConnection(dupeUuid);
        } catch (e) {
            failedSecondTry = true;
        }
        assert.ok(failedFirstTry && !failedSecondTry);
    });

});
