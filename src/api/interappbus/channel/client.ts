import { ChannelBase, ProviderIdentity } from './channel';
import Transport from '../../../transport/transport';

type DisconnectionListener = (providerIdentity: ProviderIdentity) => any;

const _supersMap: WeakMap<ChannelBase, any> = new WeakMap();
export class ChannelClient extends ChannelBase {
    private disconnectListener: DisconnectionListener;

    constructor(providerIdentity: ProviderIdentity, send: Transport['sendAction']) {
        super(providerIdentity, send, _supersMap);
        this.disconnectListener = () => undefined;
    }

    public async dispatch(action: string, payload?: any): Promise<any> {
        const protectedObj = _supersMap.get(this);
        return protectedObj.send(protectedObj.providerIdentity, action, payload);
    }

    public onDisconnection(listener: DisconnectionListener): void {
        this.disconnectListener = listener;
    }

    public async disconnect(): Promise<void> {
        const protectedObj = _supersMap.get(this);
        const { channelName, uuid, name, channelId } = protectedObj.providerIdentity;
        await protectedObj.sendRaw('disconnect-from-channel', { channelName, uuid, name });
        this.removeChannel(channelId);
    }
}
