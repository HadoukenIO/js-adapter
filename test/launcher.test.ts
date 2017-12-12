// tslint:disable: mocha-no-side-effect-code
import * as assert from 'assert';
import * as os from 'os';
import * as path from 'path';
import Launcher from '../src/launcher/launcher';
import { download, getRuntimePath, OsConfig } from '../src/launcher/mac-launch';
import { resolveRuntimeVersion, rmDir } from '../src/launcher/util';

describe('Launcher', () => {
    describe('Resolve Runtime', () => {
        it('returns the input if passed in a version number', async  () => {
            assert(await testVersion('1.1.1.1', '1.1.1.1'));
        });
        it('checks fuzzy match', async  () => {
            assert(await testVersion('7.53.*.*', makeVersionCheck(2, 21)));
        });
        it('checks for channels', async () => {
            assert(await testVersion('alpha', makeVersionCheck(0, 8)));
        });
        it('fails on a wrong channel', async () => {
            assertThrowsAsync(() => resolveRuntimeVersion('not-a-version-channel-1234587'), /Could not resolve runtime version/);
        });
    });
    describe('Launcher', () => {
        it('runs stable', async () => {
          if (Launcher.IS_SUPPORTED()) {
            const launcher = new Launcher();
            const of = await launcher.launch({
                uuid: 'sdafasdfasd',
                runtime: {version: 'community'}}, path.resolve('./app.json'), 'some port');
            //@ts-ignore: But it does when spawn is passed a file name
            assert(() => of.spawnfile.indexOf('Openfin.app') !== -1);
          } else {
              assert.ok(true, 'OS not supported');
          }
        });
    });
    if (os.platform() === 'darwin') {
        describe('Mac Launcher', async () => { //TODO mock this
           it('downloads and unzips the version', async () => {
               const version = await resolveRuntimeVersion('community');
               const location = await getRuntimePath(version);
               // tslint:disable-next-line:no-empty
               await rmDir(location, false);
               const mockConf: OsConfig = {urlPath: 'mac/x64', manifestLocation: '', namedPipeName: '', executablePath: ''};
               await doesntThrowAsync(async () => await download(version, location, mockConf));
           }).timeout(40000);
        });
    } else if (os.platform() === 'linux') {
        describe('Mac Launcher', async () => { //TODO mock this
           it('downloads and unzips the version', async () => {
               const version = await resolveRuntimeVersion('community');
               const location = await getRuntimePath(version);
               // tslint:disable-next-line:no-empty
               await rmDir(location, false);
               const mockConf: OsConfig = {urlPath: `linux/${os.arch()}`, manifestLocation: '', namedPipeName: '', executablePath: ''};
               await doesntThrowAsync(async () => await download(version, location, mockConf));
           }).timeout(40000);
        });
    }
});

function makeVersionCheck (index: number, min: number) {
    return (ans: string) => parseInt(ans.split('.')[index]) >= min;
}

async function testVersion (input: string, expected: string | Function): Promise<boolean > {
   const ans = await resolveRuntimeVersion(input);
   return typeof expected === 'string' ? ans === expected : expected(ans);
}

async function assertThrowsAsync(fn: Function, regExp: RegExp) {
    // tslint:disable-next-line:no-empty
    let f = () => {};
    try {
      await fn();
    } catch (e) {
      f = () => {throw e; };
    } finally {
      assert.throws(f, regExp);
    }
  }

async function doesntThrowAsync (fn: Function) {
        let f = () => { throw new Error('Didn\'t Throw!asdfasgsafdasdf'); };
        try {
           await fn();
        } catch (e) {
            f = () => { throw e; };
        } finally {
            assert.throws(f, /Didn't Throw!asdfasgsafdasdf/);
        }
}