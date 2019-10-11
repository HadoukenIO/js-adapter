import { ChannelBase, ProviderIdentity } from './channel';
import Transport from '../../../transport/transport';
import { Identity } from '../../../main';

export type ConnectionListener = (identity: Identity, connectionMessage?: any) => any;
export type DisconnectionListener = (identity: Identity) => any;

const _supersMap: WeakMap<ChannelBase, any> = new WeakMap();
export class ChannelProvider extends ChannelBase {
    private connectListener: ConnectionListener;
    private disconnectListener: ConnectionListener;
    public connections: Identity[];

    constructor(providerIdentity: ProviderIdentity, send: Transport['sendAction']) {
        super(providerIdentity, send, _supersMap);
        this.connectListener = () => undefined;
        this.disconnectListener = () => undefined;
        this.connections = [];
    }

    public dispatch(to: Identity, action: string, payload: any): Promise<any> {
        return _supersMap.get(this).send(to, action, payload);
    }

    public async processConnection(senderId: Identity, payload: any) {
        this.connections.push(senderId);
        return this.connectListener(senderId, payload);
    }

    public publish(action: string, payload: any): Promise<any>[] {
        return this.connections.map(to => _supersMap.get(this).send(to, action, payload));
    }

    public onConnection(listener: ConnectionListener): void {
        this.connectListener = listener;
    }

    public onDisconnection(listener: DisconnectionListener): void {
        this.disconnectListener = listener;
    }

    public async destroy(): Promise<void> {
        const protectedObj = _supersMap.get(this);
        const { channelName, channelId } = protectedObj.providerIdentity;
        await protectedObj.get(this).sendRaw('destroy-channel', { channelName });
        this.removeChannel(channelId);
    }

}
