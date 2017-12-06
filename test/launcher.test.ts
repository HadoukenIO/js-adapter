import { resolveRuntimeVersion, promisify } from '../src/launcher/util';
import Launcher from '../src/launcher/launcher'
import {download, getRuntimePath} from '../src/launcher/mac-launch';
import * as fs from 'fs'
import * as os from 'os'
import * as assert from 'assert';

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
          if (Launcher.isSupported()) {
             doesntThrowAsync(() => {
                  const launcher = new Launcher();
                  launcher.launch({uuid: 'sdafasdfasd', runtime: {version: 'stable'}}, '', 'some port');
              });
          } else {
              assert.ok(true, 'OS not supported')
          }
        });
    });
    if (os.platform() === 'darwin') {
        describe('Mac Launcher', async () => {
          await it('downloads and unzips the version', async () => {
               const version = await resolveRuntimeVersion('community');
               const location = await getRuntimePath(version);
               console.log(version)
               await rmDir(location, false);
               console.log('calling download')
               await doesntThrowAsync(async () => await download(version, location));
           })
        });
    }
});

async function rmDir (dirPath: string, removeSelf: boolean = true) {
    let files;
    try {
       files = await promisify(fs.readdir)(dirPath);
    } catch (e) {
      return;
    }
    const stat = promisify(fs.stat);
    const unlink = promisify(fs.unlink);
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const filePath = dirPath + '/' + files[i];
        const file =  await stat(filePath);
        if (file.isFile()) {
            await unlink(filePath);
        } else {
            await rmDir(filePath);
        }
      }
    }
    if (removeSelf) {
        await promisify(fs.rmdir)(dirPath);
    }
  };
function makeVersionCheck (index: number, min: number) {
    return (ans: string) => parseInt(ans.split('.')[index]) >= min;
}

async function testVersion (input: string, expected: string | function): Promise<boolean > {
   const ans = await resolveRuntimeVersion(input);
   return typeof expected === 'string' ? ans === expected : expected(ans);
};

async function assertThrowsAsync(fn, regExp) {
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
    assertThrowsAsync(async () => {
        try {
           console.log('awaiting');
           await fn();
           console.log('done');
        } catch (e) {
            console.log('caught unexpected error:');
            console.error(e);
            return;
        }
        console.log('throwing');
        throw new Error('Didn\'t Throw!asdfasgsafdasdf');
     }, /Didn't Throw!asdfasgsafdasdf/);
}