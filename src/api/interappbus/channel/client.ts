import { ChannelBase, ProviderIdentity, ProtectedItems } from './channel';
import Transport from '../../../transport/transport';

type DisconnectionListener = (providerIdentity: ProviderIdentity) => any;

const _clientProtectedMap: WeakMap<ChannelBase, ProtectedItems> = new WeakMap();
export class ChannelClient extends ChannelBase {
    private disconnectListener: DisconnectionListener;

    constructor(providerIdentity: ProviderIdentity, send: Transport['sendAction']) {
        super(providerIdentity, send, _clientProtectedMap);
        this.disconnectListener = () => undefined;
    }

    public async dispatch(action: string, payload?: any): Promise<any> {
        const protectedObj = _clientProtectedMap.get(this);
        return protectedObj.send(protectedObj.providerIdentity, action, payload);
    }

    public onDisconnection(listener: DisconnectionListener): void {
        this.disconnectListener = listener;
    }

    public async disconnect(): Promise<void> {
        const protectedObj = _clientProtectedMap.get(this);
        const { channelName, uuid, name, channelId } = protectedObj.providerIdentity;
        await protectedObj.sendRaw('disconnect-from-channel', { channelName, uuid, name });
        this.removeChannel(channelId);
    }
}
