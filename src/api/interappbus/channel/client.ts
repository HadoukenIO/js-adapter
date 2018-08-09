import { ChannelBase, ProviderIdentity } from './channel';
import Transport from '../../../transport/transport';

export class ChannelClient extends ChannelBase {
    constructor(providerIdentity: ProviderIdentity, send: Transport['sendAction']) {
        super(providerIdentity, send);
    }

    public async dispatch(action: string, payload?: any): Promise<any> {
        return this.send(this.providerIdentity, action, payload);
    }
}
