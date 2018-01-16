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
export interface BaseConfig {
    uuid: string;
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

export interface ExistingConnectConfig extends BaseConfig {
    address: string;
}

export interface NewConnectConfig extends BaseConfig {
    runtime: RuntimeConfig;
}

export type ConnectConfig = ExistingConnectConfig | NewConnectConfig;

export function isExistingConnectConfig(config: ConnectConfig): config is ExistingConnectConfig {
    if (typeof config.address === 'string') {
        return true;
    }
}

export function isNewConnectConfig(config: ConnectConfig): config is NewConnectConfig {
    if (config.runtime && typeof config.runtime.version === 'string') {
        return true;
    }
}

export enum READY_STATE { // https://github.com/websockets/ws/blob/master/doc/ws.md#ready-state-constants
    CONNECTING, // The connection is not yet open.
    OPEN,       // The connection is open and ready to communicate.
    CLOSING,    // The connection is in the process of closing.
    CLOSED      // The connection is closed.
}
