import * as fs from 'fs';
import * as path from 'path';
import { ChildProcess, spawn } from 'child_process';
import { ConfigWithRuntime } from '../transport/wire';
import { promisify } from '../util/promises';
import { resolveRuntimeVersion, rmDir, downloadFile, unzip, resolveDir, exists } from './util';
import { launch as rootLaunch } from '../main';

const mkdir = promisify(fs.mkdir);

interface SharedDownloads {
    [key: string]: Promise<string>;
}
const downloads: SharedDownloads = {};

export function getUrl(version: string, urlPath: string): string {
    const runtimeRoot = process.env.assetsUrl || 'https://cdn.openfin.co/release/runtime/';
    return `${runtimeRoot}${urlPath}/${version}`;
}

export async function download(version: string, folder: string, osConfig: OsConfig): Promise<string> {
    const url = getUrl(version, osConfig.urlPath);
    const tmp = 'tmp';
    await rmDir(folder, false);
    // tslint:disable-next-line:no-empty
    await mkdir(path.join(folder, tmp)).catch(e => { });
    const file = path.join(folder, tmp, 'tmp');
    await downloadFile(url, file);
    await unzip(file, folder);
    await rmDir(path.join(folder, tmp), true);
    return folder;
}

export async function getRuntimePath(version: string): Promise<string> {
    if (process.env.runtimeDirectory) {
        return resolveDir(process.env.runtimeDirectory, ['Runtime', version]);
    }
    const versionPath = ['OpenFin', 'Runtime', version];
    const HOME = process.env.HOME;
    return resolveDir(HOME, versionPath);
}

export async function install(versionOrChannel: string, osConfig: OsConfig): Promise<string> {
    const version = await resolveRuntimeVersion(versionOrChannel);
    const rtFolder: string = await getRuntimePath(version);
    const rtPath: string = path.join(rtFolder, osConfig.executablePath);
    const rtExists = await exists(rtPath);
    if (Boolean(rtExists)) {
        await promisify(fs.chmod)(rtPath, 0o755);
    } else {
        try {
            if (!downloads[version]) {
                downloads[version] = download(version, rtFolder, osConfig);
            }
            await downloads[version];
            downloads[version] = undefined;
        } catch (err) {
            console.error(`Failed to download, attempting to empty ${rtFolder}`);
            await rmDir(rtFolder, false);
            throw Error(`Could not install runtime ${versionOrChannel} (${version})`);
        }
    }
    return rtPath;
}

export interface OsConfig {
    manifestLocation: string;
    namedPipeName: string;
    urlPath: string;
    executablePath: string;
    appDirectoryHost: string;
}

export default async function launch(config: ConfigWithRuntime, osConfig: OsConfig): Promise<ChildProcess> {
    try {
        let fb = false;
        const runtimePath = await install(config.runtime.version, osConfig)
            .catch(e => {
                if (config.runtime.fallbackVersion !== undefined) {
                    fb = true;
                    console.warn(`could not install openfin ${config.runtime.version}`);
                    console.warn(`trying fallback ${config.runtime.fallbackVersion}`);
                    return install(config.runtime.fallbackVersion, osConfig);
                }
                return Promise.reject(e);
            });
        const args: any = config.runtime.arguments ? config.runtime.arguments.split(' ') : [];
        if (process.env.runtimeArgs) {
            args.push(process.env.runtimeArgs.split(' '));
        }

        args.unshift(`--startup-url=${osConfig.manifestLocation}`);
        args.push(`--version-keyword=${fb ? config.runtime.fallbackVersion : config.runtime.version}`);
        args.push(`--runtime-information-channel-v6=${osConfig.namedPipeName}`);
        if (config.runtime.securityRealm) {
            args.push(`--security-realm=${config.runtime.securityRealm}`);
        }
        if (config.runtime.verboseLogging) {
            args.push('--v=1');
            args.push('--attach-console');
        }
        // tslint:disable-next-line:no-use-before-declare
        await startServices(osConfig);
        return spawn(runtimePath, args);
    } catch (e) {
        console.error('Failed to launch\n', e);
        throw e;
    }
}

interface ServiceConfig {
    name: string;
    manifestUrl: string;
}

interface AppManifest {
    uuid: string;
    services: ServiceConfig[];
    runtime: ManifestRuntime;
}

interface ManifestRuntime {
    version: string;
}

const lookupServiceUrl = async (osConfig: OsConfig, serviceName: string) => {
    if (osConfig.appDirectoryHost.length > 0) {
        const lookupUrl = `${osConfig.appDirectoryHost}/api/v1/apps/${serviceName}`;
        const res = await fetch(lookupUrl);
        const json = await res.json();
        if (json) {
            return json.manifest_url;
        }
        console.error(`error getting startup url for service: ${serviceName}, url: ${lookupUrl}, json: ${JSON.stringify(json, null, 4)}`);
        return '';
    }
    console.error(`error getting startup url for ${serviceName}, host: ${osConfig.appDirectoryHost}`);
    return '';
};

const launchService = async (osConfig: OsConfig, service: ServiceConfig) => {
    let sURL = '';
    if (service.manifestUrl) {
        sURL = service.manifestUrl;
    } else {
        sURL = await lookupServiceUrl(osConfig, service.name);
    }
    await rootLaunch({ manifestUrl: sURL });
};

const loadManifest = async (path: string): Promise<AppManifest> => {
    return new Promise<AppManifest>( (res, rej) => {
        fs.readFile(path, 'utf8', (err, contents) => {
            if (err) {
                return rej(err);
            }
            res(JSON.parse(contents));
        });
    });
};

const startServices = async (osConfig: OsConfig) => {
    const manifest = await loadManifest(osConfig.manifestLocation);
    if (manifest && manifest.services) {
        for (let i = 0; i < manifest.services.length; i += 1) {
            const service = manifest.services[i];
            try {
                await launchService(osConfig, service);
            } catch (e) {
                console.error(e);
            }
        }
    }
};