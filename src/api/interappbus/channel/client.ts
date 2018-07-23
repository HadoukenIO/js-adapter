import { ChannelBase, ServiceIdentity } from './channel';
import Transport from '../../../transport/transport';

export class ChannelClient extends ChannelBase {
    public onChannelDisconnect: (f: () => void) => void;
    constructor(serviceIdentity: ServiceIdentity, send: Transport['sendAction']) {
        super(serviceIdentity, send);
    }

    public async dispatch(action: string, payload?: any): Promise<any> {
        return this.send(this.serviceIdentity, action, payload);
    }
}
