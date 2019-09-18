/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code no-empty */
import * as https from 'https';
import * as os from 'os';
import * as rimraf from 'rimraf';
import * as fs from 'fs';
import * as path from 'path';
import * as ChildProcess from 'child_process';
import { connect as rawConnect, Fin, Identity } from '../src/main';
import { resolveDir, first } from '../src/launcher/util';
import { serial, promiseMap } from '../src/util/promises';
import { delayPromise } from './delay-promise';

const appConfig = JSON.parse(fs.readFileSync(path.resolve('test/app.json')).toString());

let uuidNum = 0;
export const testVersion: string = appConfig.runtime.version;
let runtimes: Array<RuntimeProcess> = [];

let ws_port = 8690;
export const DELAY_MS = 1000;
export const TEST_TIMEOUT = 30 * 1000;

export interface RuntimeProcess {
    appConfig?: any;
    realm?: string;
    port: string;
    version: string;
    fin?: Fin;
    runtime: any;
}

async function spawnRealm(version: string, realmArg?: string, args?: Array<string>): Promise<any> {

    return new Promise((resolve, reject) => {
        resolveOpenFinVersion(version).then(async function(returnedVersion: string) {
            try {
                const realmArg = args && args.find(str => str.indexOf('security-realm') > -1);
                const realmValue = realmArg && realmArg.split('=')[1];
                const realm = realmArg || realmValue ? realmValue : `test_realm_${ Math.random() }`;
                const ofCacheFolder = await cachePath();
                const cacheDir = path.resolve(ofCacheFolder, realm);
                const appConfig = generateAppConfig();
                const configLocation = path.resolve(cacheDir, `${appConfig._startup_app.uuid}.json`);
                // tslint:disable-next-line
                const port = ++ws_port;

                args = args || [
                    '--enable-mesh',
                    `--security-realm=${realm}`
                    // '--v=1',
                    // '--enable-logging',
                    // '--debug'
                ];

                args.push(`--startup-url=${configLocation}`);
                fs.mkdirSync(cacheDir);
                appConfig.websocket_port = port;
                fs.writeFileSync(configLocation, JSON.stringify(appConfig));

                const ofEXElocation = versionPath(returnedVersion);
                const opts = {
                    env: {
                        ELECTRON_NO_ATTACH_CONSOLE: 1
                    },
                    detached: true,
                    stdio: ['pipe', 'ignore', 'pipe']
                };
                const runtime = ChildProcess.spawn(ofEXElocation, args, opts);

                await delayPromise(DELAY_MS);

                resolve({
                    appConfig,
                    port,
                    runtime,
                    realm,
                    version: returnedVersion
                });

            } catch (e) {
                reject(e);
            }

        }).catch(reject);

    });
}

function versionPath (version: string): string {
    if (os.platform() === 'win32') {
        const ofFolder = path.resolve(process.env.LOCALAPPDATA, 'OpenFin', 'runtime');
        const exeLocation = path.join('OpenFin', 'openfin.exe');

        return path.resolve(ofFolder, version, exeLocation);
    } else if (os.platform() === 'darwin') {
        const ofFolder = path.resolve(process.env.HOME, 'OpenFin', 'runtime');
        const exeLocation = path.join('OpenFin.app', 'Contents', 'MacOS', 'OpenFin');

        return path.resolve(ofFolder, version, exeLocation);
    }
}

async function cachePath(): Promise<string> {
    if (os.platform() === 'win32') {
        return resolveDir(process.env.LOCALAPPDATA, ['OpenFin', 'cache']);
    } else if (os.platform() === 'darwin') {
        return resolveDir(process.env.HOME, ['Library', 'Application Support', 'OpenFin', 'cache']);
    }
}

async function realmCachePath(realm: string): Promise<string> {
    if (os.platform() === 'win32') {
        const ofCacheFolder = path.resolve(process.env.LOCALAPPDATA, 'OpenFin', 'cache');
        return path.resolve(ofCacheFolder, realm);
        //return resolveDir(process.env.LOCALAPPDATA, ['OpenFin', 'cache', realm]);
    } else if (os.platform() === 'darwin') {
        return resolveDir(process.env.HOME, ['Library', 'Application Support', 'OpenFin', 'cache', 'realm']);
    }
}

export function getPort(fin: Fin): string {
    // @ts-ignore: TODO get current connection from fin
    return fin.wire.getPort();
}

// tslint:disable-next-line
function generateAppConfig(uuid = `uuid-${uuidNum++}`): any {

    return {
        uuid,
        _startup_app: {
            uuid,
            name: uuid,
            autoShow: true,
            url: appConfig.startup_app.url,
            saveWindowState: false,
            experimental: appConfig.startup_app.experimental,
            nonPersistent: true
        }
    };
}
function resolveOpenFinVersion(version: string): Promise<string> {
    return new Promise ((resolve, reject) => {

        // match point version eg. 6.29.17.14, fail on channels
        const isPointVersion = /\d+\.\d+\.\d+\.\d+/;
        const isChannel = !isPointVersion.test(version);

        if (isChannel) {
            const options = {
                hostname: 'developer.openfin.co',
                port: 443,
                path: `/release/runtime/${version}`,
                method: 'GET'
            };

            const req = https.request(options, (res: any) => {

                res.once('data', (versionBuff: any) => {
                    const returnedVersion = versionBuff.toString();

                    if (isPointVersion.test(returnedVersion)) {
                        resolve(returnedVersion);

                    } else {
                        reject(new Error (`version not found: ${version}`));
                    }

                });
            });

            req.on('error', reject);

            req.end();

        } else {
            resolve(version);
        }
    });

}

export function killByPort(port: string | number) {
    try {
        if (os.platform().match(/^win/)) {
            const cmd = `for /f "tokens=5" %a in \
('netstat -aon ^| find ":${port}" ^| find "LISTENING"') \
do taskkill /f /pid %a`;
            ChildProcess.execSync(cmd);
        } else {
            const cmd = `lsof -n -i4TCP:${port} | grep LISTEN | awk '{ print $2 }' | xargs kill`;
            ChildProcess.execSync(cmd);
        }
    } catch (e) {
    }
}

export function kill(fin: Fin) {
    killByPort(getPort(fin));
}

export function killByruntime(runtimeProcess: RuntimeProcess) {
    runtimeProcess.runtime.kill();
}

async function closeAndClean(runtimeProcess: RuntimeProcess): Promise<void | object> {
    return new Promise(async (resolve, reject) => {
        killByruntime(runtimeProcess);
        const cachePath = await realmCachePath(runtimeProcess.realm);
        rimraf(cachePath, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

export async function launchAndConnect(version: string = process.env.OF_VER,
                                       uuid: string = `my-uuid ${appConfig.startup_app.uuid} ${Math.floor(Math.random() * 1000)}`,
                                       realm?: string, args?: Array<string>): Promise<Fin> {

                                           const runtimeProcess = await spawnRealm(version, realm, args);
                                           const fin =  await rawConnect({
                                               address: `ws://localhost:${runtimeProcess.port}`,
                                               uuid
                                           });

                                           runtimeProcess.fin = fin;
                                           runtimes.push(runtimeProcess);
                                           return fin;
}

export async function launchX(n: number): Promise<Fin[]> {
    return serial<Fin>(Array(n).fill(launchAndConnect, 0, n));
}

export async function cleanOpenRuntimes(): Promise<void> {
    await promiseMap(runtimes, closeAndClean);
    runtimes = [];
    return null;
}

export const getRuntimeProcessInfo = (fin: Fin) => first(runtimes, x => x.fin === fin);

export const isSameIdentity = (id1: Identity, id2: Identity) => id1.name === id2.name && id1.uuid === id2.uuid;
