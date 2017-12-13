import * as rimraf from 'rimraf';
import * as fs from 'fs';
import * as path from 'path';
import { connect as rawConnect, Fin } from '../src/main';
const appConfig = JSON.parse(fs.readFileSync('test/app.json').toString());

let uuidNum = 0;
let ws_port = 9697;

let runtimes: Array<RuntimeProcess> = [];

export const DELAY_MS = 5000;
export const TEST_TIMEOUT = 12000;

export interface RuntimeProcess {
    appConfig?: any;
    realm?: string;
    fin?: Fin;
}

function spawnRealm (version: string, args?: Array<string>): Promise<RuntimeProcess> {

            // tslint:disable-next-line
            const realm = `test_realm_${ Math.random() }`;
            const cacheDir = realmCachePath(realm);
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
            fs.mkdirSync(cacheDir);

            fs.writeFileSync(configLocation, JSON.stringify(appConfig));
            return rawConnect(Object.assign(appConfig,
                {runtime:
                    {
                        version,
                        additionalArguments: args.join(' '),
                        securityRealm: realm
                    }
                })).then(fin => {
                 return {
                    appConfig,
                    fin,
                    realm
                 };
            });
}

function realmCachePath (realm: string): string {
    const ofCacheFolder = path.resolve(process.env.LOCALAPPDATA, 'OpenFin', 'cache');
    return path.resolve(ofCacheFolder, realm);
}

function generateAppConfig(): any {
    // tslint:disable-next-line
    const uuid = `uuid-${uuidNum++}`;

    return {
        // tslint:disable-next-line
        websocket_port: ws_port ++,
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
        // await runtimeProcess.fin.Application.terminate();
        rimraf.sync(realmCachePath(runtimeProcess.realm));
}

export async function launchAndConnect(version: string  = process.env.OF_VER,
                                 // tslint:disable-next-line
                                 uuid: string = `my-uuid ${ appConfig.startup_app.uuid } ${ Math.floor(Math.random() * 1000)}`,
                                 realm: boolean = false, args?: Array<string>):
                                  Promise<Fin> {
    const runtimeProcess = await spawnRealm(version, args);
    runtimes.push(runtimeProcess);
    return runtimeProcess.fin;
}

export function cleanOpenRuntimes(): Promise<void> {
    return Promise.all(runtimes.map((runtimeProcess: RuntimeProcess) => closeAndClean(runtimeProcess))).then(() => {
        runtimes = [];
        return null;
    });
}
