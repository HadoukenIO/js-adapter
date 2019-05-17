/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code no-empty */
import { conn } from './connect';
import {connect, Fin} from '../src/main';
import { kill,  TEST_TIMEOUT } from './multi-runtime-utils';
import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';

const servicePath = path.resolve('test', 'service-app.json');
const appPath = path.resolve('test', 'launch-service-app.json');

before(async function () {
    const base = JSON.parse(fs.readFileSync(path.resolve('test', 'app.json')).toString());
    const serviceConf = JSON.stringify({
        ...base,
        startup_app: { uuid: 'TESTSERVICE', name: 'TESTSERVICE', 'nonPersistent' : true }
    });
    fs.writeFileSync(servicePath, serviceConf);
    base.runtime.arguments += ' --security-realm=services-test';
    const conf = JSON.stringify({
        ...base,
        startup_app: null,
        services: [{name: 'test', manifestUrl: `file:///${servicePath}`}]});
    fs.writeFileSync(appPath, conf);
});

describe('desktop-services', function () {
    this.timeout(TEST_TIMEOUT);
    let fin: Fin;
    it('can launch an app with a service', async function () {
       fin = await connect({ manifestUrl: appPath, uuid: 'service-test-app', nonPersistent: true });
       const testFin = await conn();
       const service = testFin.Application.wrapSync({uuid: 'TESTSERVICE' });
       const isRunning = await service.isRunning();
       assert(isRunning, 'Expected service to be running');

    });

    after(async () => {
        await kill(fin);
    });

});
