import { writeFile } from 'fs';
import { randomBytes } from 'crypto';
import { Environment, notImplementedEnvErrorMsg } from './environment';
import { PortDiscovery } from '../transport/port-discovery';
import { NewConnectConfig } from '../transport/wire';
import { NotImplementedError, NotSupportedError } from '../transport/transport-errors';
import { Identity } from '../identity';

export default class NodeEnvironment implements Environment {
    private messageCounter = 0;

    public writeToken = (path: string, token: string): Promise<string> => {
        return new Promise(resolve => {
            writeFile(path, token, () => resolve(token));
        });
    }

    public retrievePort = (config: NewConnectConfig): Promise<number> => {
        const pd = new PortDiscovery(config, this);
        return pd.retrievePort();
    }

    public getNextMessageId = (): any => {
        // tslint:disable-next-line
        return this.messageCounter++;
    }

    public createChildWindow = (options: any): Promise<any> => {
        throw new NotImplementedError('Not Implemented');
    }

    public getRandomId = (): string => {
        return randomBytes(16).toString('hex');
    }

    public isWindowExists = (uuid: string, name: string): boolean => {
        throw new NotImplementedError('Not Implemented');
    }
    public getWebWindow = (identity: Identity): Window => {
        throw new NotSupportedError('Not supported outside of OpenFin web context');
    }

    public getCurrentEntityIdentity = (): Identity => {
        throw new NotImplementedError(notImplementedEnvErrorMsg);
    }
}
