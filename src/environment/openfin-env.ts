import { Environment } from './Environment';
import { ConnectConfig } from '../transport/wire';
import { NotImplementedError } from '../transport/transport-errors';

declare var fin: any;

export default class OpenFinEnvironment implements Environment {

    public writeToken = (path: string, token: string): Promise<string> => {
        throw new NotImplementedError('Not Implemented');
    }

    public retreivePort = (config: ConnectConfig): Promise<number> => {
        throw new NotImplementedError('Not Implemented');
    }

    public getNextMessageId = (): any => {
        return fin.desktop.getUuid();
    }
}
