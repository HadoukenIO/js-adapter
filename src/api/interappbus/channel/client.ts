import { ChannelBase, ProviderIdentity } from './channel';
import Transport from '../../../transport/transport';

type DisconnectionListener = (providerIdentity: ProviderIdentity) => any;

export class ChannelClient extends ChannelBase {
    private disconnectListener: DisconnectionListener;

    constructor(providerIdentity: ProviderIdentity, send: Transport['sendAction']) {
        super(providerIdentity, send);
        this.disconnectListener = () => undefined;
    }

    public async dispatch(action: string, payload?: any): Promise<any> {
        return this.send(this.providerIdentity, action, payload);
    }

    public onDisconnection(listener: DisconnectionListener): void {
        this.disconnectListener = listener;
    }

    public async disconnect(): Promise<void> {
        const { channelName, uuid, name } = this.providerIdentity;
        await this.sendRaw('disconnect-from-channel', { channelName, uuid, name });
        const { channelId } = this.providerIdentity;
        this.removeChannel(channelId);
    }
}
