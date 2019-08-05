import { launch as rootLaunch } from '../main';
import { ServiceConfig } from '../transport/wire';
import { fetchJson } from '../util/http';

const appDirectoryHost = process.env.appDirectoryHost || 'https://app-directory.openfin.co';

export interface AppDirectoryEntry {
    manifest_url: string;
}

export const lookupServiceUrl = async (serviceName: string) => {
    if (appDirectoryHost.length > 0) {
        const appUrl = `${appDirectoryHost}/api/v1/apps/services.${serviceName}`;
        const mani = await fetchJson(appUrl);
        return mani.manifest_url;
    }
    console.error(`error getting startup url for ${serviceName}, host: ${appDirectoryHost}`);
    return '';
};

export const launchService = async (service: ServiceConfig) => {
    let sURL = '';
    if (service.manifestUrl) {
        sURL = service.manifestUrl;
    } else {
        sURL = await lookupServiceUrl(service.name);
    }
    await rootLaunch({ manifestUrl: sURL });
};

export const startServices = async (services: ServiceConfig[]) => {
    for (let i = 0; i < services.length; i += 1) {
        const service = services[i];
        try {
            await launchService(service);
        } catch (e) {
            console.error(e);
        }
    }
};