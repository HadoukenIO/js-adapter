import { writeFile } from 'fs';
import { Environment } from './environment';
import { PortDiscovery } from '../transport/port-discovery';
import { ConnectConfig } from '../transport/wire';

export default class NodeEnvironment implements Environment {
    private messageCounter = 0;

    public writeToken = (path: string, token: string): Promise<string> => {
        return new Promise(resolve => {
            writeFile(path, token, () => resolve(token));
        });
    }

    public retrievePort = (config: ConnectConfig): Promise<number> => {
        const portDiscovery = new PortDiscovery(config);
        return portDiscovery.retrievePort();
    }

    public getNextMessageId = (): any => {
        // tslint:disable-next-line
        return this.messageCounter++;
    }
}
