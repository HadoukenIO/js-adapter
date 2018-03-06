import * as https from 'https';
import * as os from 'os';
import * as rimraf from 'rimraf';
import * as fs from 'fs';
import * as path from 'path';
import * as ChildProcess from 'child_process';
import { connect as rawConnect, Fin } from '../src/main';
import { resolveDir, first, serial, promiseMap } from '../src/launcher/util';
import { delayPromise } from './delay-promise';

const appConfig = JSON.parse(fs.readFileSync(path.resolve('test/app.json')).toString());

let uuidNum = 0;

let runtimes: Array<RuntimeProcess> = [];

export const DELAY_MS = 100;
export const TEST_TIMEOUT = 30 * 1000;

export interface RuntimeProcess {
    appConfig?: any;
    realm?: string;
    port: string;
    version: string;
    fin?: Fin;
}

async function spawnRealm(version: string, realm?: string, args?: Array<string>): Promise<any> {

    // tslint:disable-next-line
    return new Promise((resolve, reject) => {
        // tslint:disable-next-line no-function-expression
        resolveOpenFinVersion(version).then(async function(returnedVersion: string) {
            try {
                // tslint:disable-next-line
                const realm = `test_realm_${ Math.random() }`;
                //const cacheDir = await realmCachePath(realm);
                const ofCacheFolder = path.resolve(process.env.LOCALAPPDATA, 'OpenFin', 'cache');
                const cacheDir = path.resolve(ofCacheFolder, realm);
                const appConfig = generateAppConfig();
                const configLocation = path.resolve(cacheDir, `${appConfig.startup_app.uuid}.json`);

                args = args || [
                    '--enable-multi-runtime',
                    '--enable-mesh',
                    `--security-realm=${realm}`
                    // '--v=1',
                    // '--enable-logging',
                    // '--debug'
                ];

                args.push(`--startup-url=${configLocation}`);
                fs.mkdirSync(cacheDir);

                fs.writeFileSync(configLocation, JSON.stringify(appConfig));

                const ofEXElocation = versionPath(returnedVersion);

                const runtime = ChildProcess.spawn(ofEXElocation, args);

                runtime.on('error', reject);

                // tslint:disable-next-line no-function-expression
                const portSniffer = function(data: any) {
                    const sData = '' + data;
                    const matched = /^Opened on (\d+)/.exec(sData);

                    if (matched && matched.length > 1 ) {
                        const port = matched[1];

                        runtime.stdout.removeListener('data', portSniffer);

                        resolve({
                            appConfig,
                            port,
                            runtime,
                            realm,
                            version: returnedVersion
                        });
                    }
                };

                runtime.stdout.on('data', portSniffer);

            } catch (e) {
                reject(e);
            }

        }).catch(reject);

    });
}

function versionPath (version: string): string {
    const ofFolder = path.resolve(process.env.LOCALAPPDATA, 'OpenFin', 'runtime');
    const exeLocation = path.join('OpenFin', 'openfin.exe');

    return path.resolve(ofFolder, version, exeLocation);
}

async function realmCachePath(realm: string): Promise<string> {
    if (os.platform() === 'win32') {
        const ofCacheFolder = path.resolve(process.env.LOCALAPPDATA, 'OpenFin', 'cache');
        return path.resolve(ofCacheFolder, realm);
        //return resolveDir(process.env.LOCALAPPDATA, ['OpenFin', 'cache', realm]);
    } else {
        return resolveDir(os.tmpdir(), ['OpenFin', 'cache', realm]);
    }
}

export function getPort(fin: Fin): string {
    // @ts-ignore: TODO get current connection from fin
    return fin.wire.wire.wire.url.split(':').slice(-1)[0];
}

function generateAppConfig(): any {
    // tslint:disable-next-line
    const uuid = `uuid-${uuidNum++}`;

    return {
        uuid,
        // tslint:disable-next-line
        startup_app: {
            uuid,
            name: uuid,
            autoShow: true,
            url: appConfig.startup_app.url,
            saveWindowState: false
        }
    };
}
function resolveOpenFinVersion(version: string): Promise<string> {
    // tslint:disable-next-line
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
        // tslint:disable-next-line:no-empty
    } catch (e) {
    }
}

export function kill(fin: Fin) {
    killByPort(getPort(fin));
}

async function closeAndClean(runtimeProcess: RuntimeProcess): Promise<void> {
    killByPort(runtimeProcess.port);
    // give some time for rvm process to be killed
    await delayPromise(DELAY_MS);
    const cachePath = await realmCachePath(runtimeProcess.realm);
    rimraf.sync(cachePath);
}

export async function launchAndConnect(version: string = process.env.OF_VER,
                                       // tslint:disable-next-line
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
