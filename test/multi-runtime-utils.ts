import * as os from 'os';
import * as rimraf from 'rimraf';
import * as fs from 'fs';
import * as path from 'path';
import * as ChildProcess from 'child_process';
import { connect as rawConnect, Fin } from '../src/main';
import { resolveDir, promisify, first, serial, promiseMap } from '../src/launcher/util';
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

async function spawnRealm(version: string, realm?: string, args?: Array<string>): Promise<RuntimeProcess> {

    // tslint:disable-next-line
    realm = realm || `test_realm_${Math.random()}`;
    const cacheDir = await realmCachePath(realm);
    const appConfig = generateAppConfig();
    const configLocation = path.resolve(cacheDir, `${appConfig.startup_app.uuid}.json`);

    args = args || [
        '--enable-multi-runtime',
        '--enable-mesh'
        // '--v=1',
        // '--enable-logging',
        // '--debug'
    ];

    args.push(`--startup-url=${configLocation}`);

    await promisify(fs.writeFile)(configLocation, JSON.stringify(appConfig));
    const fin = await rawConnect(Object.assign(appConfig,
        {
            runtime:
                {
                    version,
                    arguments: args.join(' '),
                    securityRealm: realm,
                    rvmDir: process.env.RVM_DIR
                }
        }));
    const v = await fin.System.getVersion();
    return {
        appConfig,
        fin,
        version: v,
        // @ts-ignore: TODO get current connection from fin
        port: getPort(fin),
        realm
    };
}

async function realmCachePath(realm: string): Promise<string> {
    if (os.platform() === 'win32') {
        return resolveDir(process.env.LOCALAPPDATA, ['OpenFin', 'cache', realm]);
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
    realm?: string, args?: Array<string>):
    Promise<Fin> {
    const runtimeProcess = await spawnRealm(version, realm, args);
    runtimes.push(runtimeProcess);
    return runtimeProcess.fin;
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
