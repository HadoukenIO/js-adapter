import * as rimraf from "rimraf";
import { spawn } from  "child_process";
import * as fs from "fs";
import * as https from "https";
import * as path from "path";
import { connect as rawConnect } from "../src/main";

describe(`multi runtime`, () => {

    it(`should fire listener on remote runtime`, (done) => {
        Promise.all([launchAndConnect(), launchAndConnect()]).then((conns: any) => {
            const [{appConfig: {startup_app:{uuid}}},
                   {fin}] = conns;

            // give the initial runtime app a bit to complete spinup
            setTimeout(() => {
                fin.Window.wrap({uuid, name: uuid}).once(`bounds-changed`, () => {
                    done();
                });
                fin.Window.wrap({uuid, name: uuid}).moveBy(500, 500);
            }, 3000);

        });
    });
});

let uuidNum = 0;
let ws_port = 9697;

function generateAppConfig() {
    const uuid = `uuid-${uuidNum++}`;

    return {
        websocket_port: ws_port ++, 
        startup_app: {
            uuid,
            name: uuid,
            autoShow: true,
            url: `about:blank`
        }
    };
}

function launchAndConnect(version = `6.49.18.31`, uuid = `my-uuid`, realm = false) {

    return new Promise((resolve, reject) => {

        // stagger the launches or this tends to cause copy data errors... 
        spawnRealm(version).then((rt: any) => {
            rawConnect({
                address: `ws://localhost:${rt.port}`,
                uuid
            }).then((fin: any) => {
                resolve(Object.assign({fin}, rt));
            });

        });
    });
}

function spawnRealm (version: string, requestedRealm = ``) {

    return new Promise((resolve, reject) => {

        resolveOpenFinVersion(version).then(function(returnedVersion: string){
            const realm = requestedRealm ? requestedRealm : `test_realm_${Math.random()}`;
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
                                       `--security-realm=${realm}`
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
                            realm,
                            cleanCacheDir: () => {
                                rimraf.sync(realmCachePath(realm));
                            }
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

function resolveOpenFinVersion(version: string) {
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

function versionPath (version: string) {
    const ofFolder = path.resolve(process.env[`LOCALAPPDATA`], `OpenFin`, `runtime`);
    const exeLocation = path.join(`OpenFin`, `openfin.exe`);

    return path.resolve(ofFolder, version, exeLocation);
}

function realmCachePath (realm: string) {
    const ofCacheFolder = path.resolve(process.env[`LOCALAPPDATA`], `OpenFin`, `cache`);

    return path.resolve(ofCacheFolder, realm);
}

// export {spawnRealm};
// export {launchAndConnect};
