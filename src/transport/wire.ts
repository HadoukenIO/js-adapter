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

export interface ConnectConfig {
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
    runtime?: {
        version: string;
        fallbackVersion?: string;
        securityRealm?: string;
        verboseLogging?: boolean;
        additionalArgument?: string;
    };
    appAssets?: [ {
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

export enum READY_STATE { // https://github.com/websockets/ws/blob/master/doc/ws.md#ready-state-constants
    CONNECTING, // The connection is not yet open.
    OPEN,       // The connection is open and ready to communicate.
    CLOSING,    // The connection is in the process of closing.
    CLOSED      // The connection is closed.
}
