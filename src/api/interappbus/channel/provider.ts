import { ChannelBase, ProviderIdentity } from './channel';
import Transport from '../../../transport/transport';
import { Identity } from '../../../main';

export type ConnectionListener = (identity: Identity, connectionMessage?: any) => any;

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
        return this.send(to, action, payload);
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

}