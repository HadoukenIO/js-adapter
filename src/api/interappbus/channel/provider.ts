import { ChannelBase, serviceIdentity } from './channel';
import Transport from '../../../transport/transport';

export type ConnectionListener = (adapterIdentity: serviceIdentity, connectionMessage?: any) => any;

export class ChannelProvider extends ChannelBase {
    private connectListener: ConnectionListener;
    private disconnectListener: ConnectionListener;
    private connections: serviceIdentity[];

    constructor(serviceIdentity: serviceIdentity, send: Transport['sendAction']) {
        super(serviceIdentity, send);
        this.connectListener = () => undefined;
        this.disconnectListener = () => undefined;
        this.connections = [];
    }

    public dispatch(to: serviceIdentity, action: string, payload: any): Promise<any> {
        return this.send(to, action, payload);
    }

    public async processConnection(senderId: serviceIdentity, payload: any) {
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