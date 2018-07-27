import { ChannelClient } from './client';
import { Identity } from '../../../identity';
import { ChannelProvider } from './provider';
import { EmitterBase } from '../../base';
import Transport, { Message, Payload } from '../../../transport/transport';

export interface Options {
    wait?: boolean;
    uuid: string;
    payload?: any;
}

export interface ChannelPayload {
    payload: Payload;
}
export interface ChannelMessage extends Message<any> {
  senderIdentity: Identity;
  ackToSender: any;
  serviceIdentity: Identity;
  connectAction: boolean;
}

export class Channel extends EmitterBase {
    private channelMap: Map<string, ChannelProvider | ChannelClient>;
    constructor(wire: Transport) {
        super(wire);
        this.topic = 'service';
        this.channelMap = new Map();
        wire.registerMessageHandler(this.onmessage.bind(this));
    }

    public async onChannelConnect(identity: Identity, listener: EventListener): Promise<void> {
            this.registerEventListener({
                topic: 'service',
                type: 'connected',
                ...identity
            });
            this.on('connected', listener);
    }

    public async connect(options: Options): Promise<ChannelClient> {
        try {
            const { payload: { data: serviceIdentity } } = await this.wire.sendAction('send-service-message', Object.assign({
                connectAction: true,
                wait: true
            }, options));
            const channel = new ChannelClient(serviceIdentity, this.wire.sendAction.bind(this.wire));
            channel.onChannelDisconnect = (listener: () => void) => {
                this.registerEventListener({
                    topic: 'service',
                    type: 'disconnected',
                    ...serviceIdentity
                });
                this.on('disconnected', listener);
            };
            const key = serviceIdentity.channelId || serviceIdentity.uuid;
            this.channelMap.set(key, channel);
            return channel;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    public async create(): Promise<ChannelProvider> {
        const { payload: { data: serviceIdentity } } = await this.wire.sendAction('register-service', {});
        const channel = new ChannelProvider(serviceIdentity, this.wire.sendAction.bind(this.wire));
        const key = serviceIdentity.channelId || serviceIdentity.uuid;
        this.channelMap.set(key, channel);
        return channel;
    }
    public onmessage = (msg: ChannelMessage) => {
      if (msg.action === 'process-service-action') {
          this.processChannelMessage(msg);
          return true;
      }
      return false;
    }
    private async processChannelMessage (msg: ChannelMessage) {
        const { senderIdentity, serviceIdentity, action, ackToSender, payload, connectAction} = msg.payload;
        const key = serviceIdentity.channelId || serviceIdentity.uuid;
        const bus = this.channelMap.get(key);
        try {
            let res;
            if (!bus) {
                return;
            }
            if (connectAction) {
                if (!(bus instanceof ChannelProvider)) {
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
