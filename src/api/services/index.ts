import { Client } from './client';
import { Identity } from '../../identity';
import { Provider } from './provider';
import { Base } from '../base';
import Transport, { Message, Payload } from '../../transport/transport';

export interface Options {
    wait?: boolean;
    uuid: string;
    payload?: any;
}

export interface ServicePayload {
    payload: Payload;
}
export interface ServiceMessage extends Message<any> {
  senderIdentity: Identity;
  ackToSender: any;
  serviceIdentity: Identity;
  connectAction: boolean;
}

export class Service extends Base {
    private serviceMap: Map<string, Provider | Client>;
    constructor(wire: Transport) {
        super(wire);
        this.serviceMap = new Map();
        wire.registerMessageHandler(this.onmessage.bind(this));
    }

    public async onServiceConnect(identity: Identity, listener: EventListener): Promise<void> {
            this.registerEventListener({
                topic: 'service',
                type: 'connected',
                ...identity
            });
            this.on('connected', listener);
    }

    public async connect(options: Options): Promise<Client> {
        try {
            const { payload: { data: serviceIdentity } } = await this.wire.sendAction('send-service-message', Object.assign({
                connectAction: true,
                wait: true
            }, options));
            const channel = new Client(serviceIdentity, this.wire.sendAction.bind(this.wire));
            channel.onServiceDisconnect = (listener: () => void) => {
                this.registerEventListener({
                    topic: 'service',
                    type: 'disconnected',
                    ...serviceIdentity
                });
                this.on('disconnected', listener);
            };
            this.serviceMap.set(serviceIdentity.uuid, channel);
            return channel;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    public async register(): Promise<Provider> {
        const { payload: { data: serviceIdentity } } = await this.wire.sendAction('register-service', {});
        const channel = new Provider(this.wire.sendAction.bind(this.wire));
        this.serviceMap.set(serviceIdentity.uuid, channel);
        return channel;
    }
    public onmessage = (msg: ServiceMessage) => {
      if (msg.action === 'process-service-action') {
          this.processServiceMessage(msg);
          return true;
      }
      return false;
    }
    private async processServiceMessage (msg: ServiceMessage) {
        const { senderIdentity, serviceIdentity, action, ackToSender, payload, connectAction} = msg.payload;
        const bus = this.serviceMap.get(serviceIdentity.uuid);
        try {
            let res;
            if (!bus) {
                return;
            }
            if (connectAction) {
                if (!(bus instanceof Provider)) {
                    throw Error('Cannot connect to a plugin');
                }
                res = await bus.processConnection(senderIdentity, payload);
            } else {
                res = await bus.processAction(action, payload, senderIdentity);
            }
            ackToSender.payload.payload = ackToSender.payload.payload || {};
            ackToSender.payload.payload.result = res;
            this.wire.sendRaw(ackToSender);
        } catch (e) {
            ackToSender.success = false;
            ackToSender.reason = e.message;
            this.wire.sendRaw(ackToSender);
        }
    }

}

interface PluginSubscribeSuccess {
    uuid: string;
    name: string;
    serviceName: string;
}
