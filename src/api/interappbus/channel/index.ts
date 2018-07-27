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
  providerIdentity: Identity;
  connectAction: boolean;
}

export class Channel extends EmitterBase {
    private channelMap: Map<string, ChannelProvider | ChannelClient>;
    constructor(wire: Transport) {
        super(wire);
        this.topic = 'channel';
        this.channelMap = new Map();
        wire.registerMessageHandler(this.onmessage.bind(this));
    }

    public async onChannelConnect(identity: Identity, listener: EventListener): Promise<void> {
            this.registerEventListener({
                topic: 'channel',
                type: 'connected',
                ...identity
            });
            this.on('connected', listener);
    }

    public async connect(options: Options): Promise<ChannelClient> {
        try {
            const { payload: { data: providerIdentity } } = await this.wire.sendAction('connect-to-channel', Object.assign({
                wait: true
            }, options));
            const channel = new ChannelClient(providerIdentity, this.wire.sendAction.bind(this.wire));
            channel.onChannelDisconnect = (listener: () => void) => {
                this.registerEventListener({
                    topic: 'channel',
                    type: 'disconnected',
                    ...providerIdentity
                });
                this.on('disconnected', listener);
            };
            const key = providerIdentity.channelId || providerIdentity.uuid;
            this.channelMap.set(key, channel);
            return channel;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    public async create(serviceName?: string): Promise<ChannelProvider> {
        const { payload: { data: providerIdentity } } = await this.wire.sendAction('create-channel', {serviceName});
        const channel = new ChannelProvider(providerIdentity, this.wire.sendAction.bind(this.wire));
        const key = providerIdentity.channelId || providerIdentity.uuid;
        this.channelMap.set(key, channel);
        return channel;
    }
    public onmessage = (msg: ChannelMessage) => {
      if (msg.action === 'process-channel-message') {
          this.processChannelMessage(msg);
          return true;
      }
      return false;
    }
    private async processChannelMessage (msg: ChannelMessage) {
        const { senderIdentity, providerIdentity, action, ackToSender, payload, connectAction} = msg.payload;
        const key = providerIdentity.channelId || providerIdentity.uuid;
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
