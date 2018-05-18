/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code no-empty */
import {connect, Fin} from '../src/main';
import { cleanOpenRuntimes, TEST_TIMEOUT, kill } from './multi-runtime-utils';
import * as fs from 'fs';
import * as path from 'path';

const tempPath = path.resolve('test', 'service-app.json');

before(async function () {
    const base = JSON.parse(fs.readFileSync(path.resolve('test', 'app.json')).toString());
    base.runtime.arguments += ' --security-realm=services-test';
    const conf = JSON.stringify({
        ...base,
        startup_app: null,
        services: [{name: 'layouts'}]});
    fs.writeFileSync(tempPath, conf);
    await cleanOpenRuntimes();
});

describe('desktop-services', function () {
    this.timeout(TEST_TIMEOUT);
    let fin: Fin;
    it('can launch an app with a service', async function () {
       fin = await connect({manifestUrl: tempPath, uuid: 'service-test-app'});
    });
    after(async function () {
        await kill(fin);
    });
});