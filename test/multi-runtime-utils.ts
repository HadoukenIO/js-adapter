import * as os from 'os';
import * as rimraf from 'rimraf';
import * as fs from 'fs';
import * as path from 'path';
import { connect as rawConnect, Fin } from '../src/main';
import { resolveDir, promisify } from '../src/launcher/util';
const appConfig = JSON.parse(fs.readFileSync(path.resolve('test/app.json')).toString());

console.log(appConfig);

let uuidNum = 0;
let ws_port = 9697;

let runtimes: Array<RuntimeProcess> = [];

export const DELAY_MS = 50;
export const TEST_TIMEOUT = 15000;

export interface RuntimeProcess {
    appConfig?: any;
    realm?: string;
    port: string;
    version: string;
    fin?: Fin;
}

async function spawnRealm(version: string, args?: Array<string>): Promise<RuntimeProcess> {

    // tslint:disable-next-line
    const realm = `test_realm_${Math.random()}`;
    const cacheDir = await realmCachePath(realm);
    console.log('made dir', cacheDir)
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
    console.log('connecting')
    const fin = await rawConnect(Object.assign(appConfig,
        {
            runtime:
                {
                    version,
                    additionalArguments: args.join(' '),
                    securityRealm: realm
                }
        }));
    console.log('connect returned')
    const v = await fin.System.getVersion();

    return {
        appConfig,
        fin,
        version: v,
        port: fin.wire.wire.wire.url.split(':').slice(-1),
        realm
    };
}

async function realmCachePath(realm: string): Promise<string> {
    return resolveDir(os.tmpdir(), ['OpenFin', 'cache', realm]);
}

function generateAppConfig(): any {
    // tslint:disable-next-line
    const uuid = `uuid-${uuidNum++}`;

    return {
        // tslint:disable-next-line
        uuid,
        websocket_port: ws_port++,
        startup_app: {
            uuid,
            name: uuid,
            autoShow: true,
            url: appConfig.startup_app.url,
            saveWindowState: false
        }
    };
}

async function closeAndClean(runtimeProcess: RuntimeProcess): Promise<void> {
    // await runtimfin.eProcess.fin.Application.terminate();
    const cachePath = await realmCachePath(runtimeProcess.realm);
    rimraf.sync(cachePath);
}

export async function launchAndConnect(version: string = process.env.OF_VER,
    // tslint:disable-next-line
    uuid: string = `my-uuid ${appConfig.startup_app.uuid} ${Math.floor(Math.random() * 1000)}`,
    realm: boolean = false, args?: Array<string>):
    Promise<Fin> {
    console.log('launching')
    const runtimeProcess = await spawnRealm(version, args).catch(console.error);
    runtimes.push(runtimeProcess);
    console.log('launched')
    return runtimeProcess.fin;
}

export function cleanOpenRuntimes(): Promise<void> {
    return Promise.all(runtimes.map((runtimeProcess: RuntimeProcess) => closeAndClean(runtimeProcess))).then(() => {
        runtimes = [];
        return null;
    });
}

export function getRuntimeProcessInfo(fin: Fin) {
    for (let i = 0; i < runtimes.length; i++) {
        const r = runtimes[i];
        if (r.fin === fin) {
            return r;
        }
    }
}
