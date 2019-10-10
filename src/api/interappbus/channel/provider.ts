import { ChannelBase, ProviderIdentity } from './channel';
import Transport from '../../../transport/transport';
import { Identity } from '../../../main';

export type ConnectionListener = (identity: Identity, connectionMessage?: any) => any;
export type DisconnectionListener = (identity: Identity) => any;

export class ChannelProvider extends ChannelBase {
    private connectListener: ConnectionListener;
    private disconnectListener: ConnectionListener;
    public connections: Identity[];

    constructor(providerIdentity: ProviderIdentity, send: Transport['sendAction']) {
        super(providerIdentity, send);
        this.connectListener = () => undefined;
        this.disconnectListener = () => undefined;
        this.connections = [];
    }

    public dispatch(to: Identity, action: string, payload: any): Promise<any> {
        // verify if the client is valid
        if (this.connections.some(c => c.name === to.name && c.uuid === to.uuid)) {
            return this.send(to, action, payload);
        } else {
            throw new Error('Not a valid client');
        }
    }

    public async processConnection(senderId: Identity, payload: any) {
        this.connections.push(senderId);
        return this.connectListener(senderId, payload);
    }

    public publish(action: string, payload: any): Promise<any>[] {
        return this.connections.map(to => this.send(to, action, payload));
    }

    public onConnection(listener: ConnectionListener): void {
        this.connectListener = listener;
    }

    public onDisconnection(listener: DisconnectionListener): void {
        this.disconnectListener = listener;
    }

    public async destroy(): Promise<void> {
        const { channelName } = this.providerIdentity;
        await this.sendRaw('destroy-channel', { channelName });
        const { channelId } = this.providerIdentity;
        this.removeChannel(channelId);
    }

}