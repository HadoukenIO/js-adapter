import { ConnectConfig, isExternalConfig, InternalConnectConfig, ExternalConfig, isInternalConnectConfig } from '../transport/wire';
import * as fs from 'fs';
import { promisify } from './promises';
import { fetchJson } from './http';

async function readLocalConfig(location: string): Promise<any> {
    const txt = await promisify(fs.readFile)(location);
    return JSON.parse(txt.toString());
}

async function loadConfig(config: ExternalConfig): Promise<any> {
   try {
       return await fetchJson(config.manifestUrl);
   } catch (e) {
       try {
           return await readLocalConfig(config.manifestUrl);
       }  catch (e) {
          throw new Error('Could not locate JSON at supplied manifestUrl: ' + config.manifestUrl);
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
        if (Array.isArray(loadedConfig.services)) {
            testThisConfig.services = loadedConfig.services;
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
