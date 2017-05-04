import * as rimraf from "rimraf";
import { spawn, ChildProcess } from  "child_process";
import * as fs from "fs";
import * as https from "https";
import * as path from "path";
import { connect as rawConnect } from "../src/main";
const appConfig = JSON.parse(fs.readFileSync("test/app.json").toString());

let uuidNum = 0;
let ws_port = 9697;

let runtimes: Array<RuntimeProcess> = [];

export interface RuntimeProcess {
    appConfig: any;
    port: string;
    runtime: ChildProcess;
    realm: string;
    fin?: any;
};

function spawnRealm (version: string): Promise<RuntimeProcess> {

    return new Promise((resolve, reject) => {

        resolveOpenFinVersion(version).then(function(returnedVersion: string){
            const realm = `test_realm_${Math.random()}`;
            const cacheDir = realmCachePath(realm);
            const appConfig = generateAppConfig();
            const configLocation = path.resolve(cacheDir, `${appConfig.startup_app.uuid}.json`);

            fs.mkdirSync(cacheDir);

            fs.writeFileSync(configLocation, JSON.stringify(appConfig));

            const ofEXElocation = versionPath(returnedVersion);

            try {

                const runtime = spawn(ofEXElocation,
                                      [`--startup-url=${configLocation}`,
                                       `--attach-console`,
                                       `--enable-multi-runtime`,
                                       `--v=1`,
                                       `--security-realm=${realm}`,
                                       `--enable-mesh`
                                      ]);
                runtime.on(`error`, reject);

                const portSniffer = function(data: any) {
                    const sData = `` + data;
                    const matched = /^Opened on (\d+)/.exec(sData);

                    if (matched && matched.length > 1 ) {
                        const port = matched[1];

                        runtime.stdout.removeListener(`data`, portSniffer);

                        resolve({
                            appConfig,
                            port,
                            runtime,
                            realm
                        });
                    }
                };

                runtime.stdout.on(`data`, portSniffer);

            } catch (e) {
                reject(e);
            }

        }).catch(reject);

    });

}

function resolveOpenFinVersion(version: string): Promise<string> {
    return new Promise((resolve, reject) => {

        // match point version eg. 6.29.17.14, fail on channels
        const isPointVersion = /\d+\.\d+\.\d+\.\d+/;
        const isChannel = !isPointVersion.test(version);

        if (isChannel) {
            const options = {
                hostname: `developer.openfin.co`,
                port: 443,
                path: `/release/runtime/${version}`,
                method: `GET`
            };

            const req = https.request(options, (res: any) => {

                res.once(`data`, (versionBuff: any) => {
                    const returnedVersion = versionBuff.toString();

                    if (isPointVersion.test(returnedVersion)) {
                        resolve(returnedVersion);

                    } else {
                        reject(new Error (`version not found: ${version}`));
                    }

                });
            });

            req.on(`error`, reject);

            req.end();

        } else {
            resolve(version);
        }
    });

}

function realmCachePath (realm: string): string {
    const ofCacheFolder = path.resolve(process.env[`LOCALAPPDATA`], `OpenFin`, `cache`);

    return path.resolve(ofCacheFolder, realm);
}

function generateAppConfig(): any {
    const uuid = `uuid-${uuidNum++}`;

    return {
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

function versionPath (version: string): string {
    const ofFolder = path.resolve(process.env[`LOCALAPPDATA`], `OpenFin`, `runtime`);
    const exeLocation = path.join(`OpenFin`, `openfin.exe`);

    return path.resolve(ofFolder, version, exeLocation);
}

function closeAndClean(runtimeProcess: RuntimeProcess): Promise<RuntimeProcess> {
    return new Promise((resolve, reject) => {
        runtimeProcess.runtime.once(`exit`, () => {
            rimraf.sync(realmCachePath(runtimeProcess.realm));
            resolve();
        });
        
        runtimeProcess.runtime.kill();
    });
}

export function launchAndConnect(version = appConfig.runtime.version, uuid = `my-uuid`, realm = false): Promise<RuntimeProcess> {
    
    return new Promise((resolve, reject) => {
        
        spawnRealm(version).then((runtimeProcess: RuntimeProcess) => {
            rawConnect({
                address: `ws://localhost:${runtimeProcess.port}`,
                uuid
            }).then((fin: any) => {
                runtimeProcess.fin = fin;
                runtimes.push(runtimeProcess);
                resolve(runtimeProcess);
            });

        });
    });
}

export function cleanOpenRuntimes(): Promise<void> {
    return Promise.all(runtimes.map((runtimeProcess: RuntimeProcess) => closeAndClean(runtimeProcess))).then(() => {
        runtimes = [];
        return null;
    });
}
