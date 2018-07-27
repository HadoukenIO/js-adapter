import { ChannelBase, ProviderIdentity } from './channel';
import Transport from '../../../transport/transport';

export type ConnectionListener = (adapterIdentity: ProviderIdentity, connectionMessage?: any) => any;

export class ChannelProvider extends ChannelBase {
    private connectListener: ConnectionListener;
    private disconnectListener: ConnectionListener;
    public connections: ProviderIdentity[];

    constructor(providerIdentity: ProviderIdentity, send: Transport['sendAction']) {
        super(providerIdentity, send);
        this.connectListener = () => undefined;
        this.disconnectListener = () => undefined;
        this.connections = [];
    }

    public dispatch(to: ProviderIdentity, action: string, payload: any): Promise<any> {
        return this.send(to, action, payload);
    }

    public async processConnection(senderId: ProviderIdentity, payload: any) {
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