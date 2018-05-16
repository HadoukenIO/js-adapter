import { ConnectConfig, isExternalConfig, InternalConnectConfig, ExternalConfig, isInternalConnectConfig } from '../transport/wire';
import { Url, parse } from 'url';
import { IncomingMessage } from 'http';
import * as fs from 'fs';
import { promisify } from '../util/promises';

async function readLocalConfig(location: string): Promise<any> {
    const txt = await promisify(fs.readFile)(location);
    return JSON.parse(txt.toString());
}

async function downloadConfig (url: Url): Promise<any> {
    const protocol = await import(url.protocol.slice(0, -1));
    const res = await new Promise<string>(async (resolve, reject) => {
        const request = protocol.get(url, (response: IncomingMessage) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            const body: string[] = [];
            response.on('data', (chunk: string): void => {
                body.push(chunk);
            });
            response.on('end', (): void => resolve(body.join('')));
        });
        request.on('error', (err: any) => reject(err));
    });
    return JSON.parse(res);
}

async function loadConfig(config: ExternalConfig): Promise<any> {
   try {
       const x = parse(config.manifestUrl);
       return await downloadConfig(x);
   } catch (e) {
       try {
           return await readLocalConfig(config.manifestUrl);
       }  catch (e) {
          throw new Error('Could not locate JSON at supplied manifestUrl');
       }
   }
}

export async function normalizeConfig (config: ConnectConfig): Promise<InternalConnectConfig | ExternalConfig> {
    const testThisConfig: ConnectConfig = config;
    if (isExternalConfig(config)) {
        const loadedConfig = await loadConfig(config);
        testThisConfig.runtime = loadedConfig.runtime;
        if (typeof loadedConfig.assetsUrl === 'string') {
            testThisConfig.assetsUrl = loadedConfig.assetsUrl;
        }
    }
    return testThisConfig;
}

export async function validateConfig(config: ConnectConfig) {
    const normalized = await normalizeConfig(config);
    if (isInternalConnectConfig(normalized)) {
        return normalized;
    } else {
        throw new Error('Invalid Config');
    }
}
