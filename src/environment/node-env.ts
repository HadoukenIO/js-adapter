import { writeFile } from 'fs';
import { Environment } from './environment';
import { PortDiscovery } from '../transport/port-discovery';
import { NewConnectConfig } from '../transport/wire';

export default class NodeEnvironment implements Environment {
    private messageCounter = 0;

    public writeToken = (path: string, token: string): Promise<string> => {
        return new Promise(resolve => {
            writeFile(path, token, () => resolve(token));
        });
    }

    public retreivePort = (config: NewConnectConfig): Promise<number> => {
        const pd = new PortDiscovery(config);
        return pd.retrievePort();
    }

    public getNextMessageId = (): any => {
        // tslint:disable-next-line
        return this.messageCounter++;
    }
}
