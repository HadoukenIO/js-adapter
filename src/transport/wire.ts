import { EventEmitter } from 'events';

export interface Wire extends EventEmitter {
    connect(address: string): Promise<any>;
    connectSync(): any;
    send(data: any): Promise<any>;
    shutdown(): Promise<void>;
}
export interface WireConstructor {
    new(onmessage: (data: any) => void): Wire;
}

export interface RuntimeConfig {
    version: string;
    fallbackVersion?: string;
    securityRealm?: string;
    verboseLogging?: boolean;
    // tslint:disable-next-line:no-banned-terms
    arguments?: string;
    rvmDir?: string;

}

export interface ServiceConfig {
    name: string;
    manifestUrl: string;
}

export interface BaseConfig {
    uuid?: string;
    address?: string;
    name?: string;
    nonPersistent?: boolean;
    runtimeClient?: boolean;
    licenseKey?: string;
    client?: any;
    manifestUrl?: string;
    startupApp?: any;
    lrsUrl?: string;
    assetsUrl?: string;
    devToolsPort?: number;
    installerUI?: boolean;
    runtime?: RuntimeConfig;
    services?: ServiceConfig[];
    appAssets?: [{
        src: string;
        alias: string;
        target: string;
        version: string;
        args: string
    }
    ];
    customItems?: [any];
    timeout?: number; // in seconds
}

export interface ConfigWithUuid extends BaseConfig {
    uuid: string;
}

export interface ExistingConnectConfig extends ConfigWithUuid {
    address: string;
}

export interface ConfigWithRuntime extends BaseConfig {
    runtime: RuntimeConfig;
}

export interface ExternalConfig extends BaseConfig {
    manifestUrl: string;
}

export type NewConnectConfig = ConfigWithUuid & ConfigWithRuntime;

export type PortDiscoveryConfig = (ExternalConfig & ConfigWithRuntime) | NewConnectConfig;

export type ConnectConfig = ExistingConnectConfig | NewConnectConfig | ExternalConfig;

export type InternalConnectConfig = ExistingConnectConfig | NewConnectConfig;

export function isExternalConfig(config: ConnectConfig): config is ExternalConfig {
    if (typeof config.manifestUrl === 'string') {
        return true;
    }
}

export function isExistingConnectConfig(config: any): config is ExistingConnectConfig {
    return hasUuid(config) && typeof config.address === 'string';
}

function hasUuid(config: any): config is ConfigWithUuid {
    return typeof config.uuid === 'string';
}

function hasRuntimeVersion (config: any): config is ConfigWithRuntime {
    return config.runtime && typeof config.runtime.version === 'string';
}

export function isNewConnectConfig(config: any): config is NewConnectConfig {
    return hasUuid(config) && hasRuntimeVersion(config);
}

export function isPortDiscoveryConfig(config: any): config is PortDiscoveryConfig {
    return (isExternalConfig(config) && hasRuntimeVersion(config)) || isNewConnectConfig(config);
}

export function isInternalConnectConfig (config: any): config is InternalConnectConfig {
   return isExistingConnectConfig(config) || isNewConnectConfig(config);
}

export enum READY_STATE { // https://github.com/websockets/ws/blob/master/doc/ws.md#ready-state-constants
    CONNECTING, // The connection is not yet open.
    OPEN,       // The connection is open and ready to communicate.
    CLOSING,    // The connection is in the process of closing.
    CLOSED      // The connection is closed.
}
