import { ChannelClient } from './client';
import { Identity } from '../../../identity';
import { ChannelProvider } from './provider';
import { EmitterBase } from '../../base';
import Transport, { Message, Payload } from '../../../transport/transport';
import { ProviderIdentity } from './channel';
import { ChannelEvents, ChannelEvent } from '../../events/channel';

export interface ConnectOptions {
    wait?: boolean;
    payload?: any;
}

export interface ChannelPayload {
    payload: Payload;
}
export interface ChannelMessage extends Message<any> {
  senderIdentity: Identity;
  ackToSender: any;
  providerIdentity: ProviderIdentity;
  connectAction: boolean;
}

export class Channel extends EmitterBase<ChannelEvents> {
    private channelMap: Map<string, ChannelProvider | ChannelClient>;
    constructor(wire: Transport) {
        super(wire, ['channel']);
        this.topic = 'channel';
        this.channelMap = new Map();
        wire.registerMessageHandler(this.onmessage.bind(this));
    }

    public async getAllChannels(): Promise<ProviderIdentity[]> {
        return this.wire.sendAction('get-all-channels')
            .then(({ payload }) => payload.data);
    }

    public async onChannelConnect(listener: (...args: any[]) => void): Promise<void> {
        await this.on('connected', listener);
    }

    public async onChannelDisconnect(listener: (...args: any[]) => void): Promise<void> {
        await this.on('disconnected', listener);
    }

    public async connect(channelName: string, options?: ConnectOptions): Promise<ChannelClient> {
        if (!channelName || typeof channelName !== 'string') {
            throw new Error('Please provide a channelName string to connect to a channel.');
        }
        const opts: any = options || {};
        let resolver: (arg?: any) => void;
        let listener: (evt: ChannelEvent<'connected'>) => void;
        const waitResponse: Promise<ChannelClient> = new Promise(resolve => {
            resolver = resolve;
            listener = (payload: ChannelEvent<'connected'>) => {
                if (channelName === payload.channelName) {
                    this.removeListener('connected', listener);
                    this.connect(channelName, opts).then(response => {
                        resolve(response);
                    });
                }
            };
            this.on('connected', listener);
        });
        try {
            const { payload: { data: providerIdentity } } = await this.wire.sendAction('connect-to-channel', { channelName, ...opts});
            // If there isn't a matching channel, the above sendAction call will error out and go to catch, skipping the logic below
            if (resolver) {
                resolver();
            }
            this.removeListener('connected', listener);
            const channel = new ChannelClient(providerIdentity, this.wire.sendAction.bind(this.wire));
            const key = providerIdentity.channelId;
            this.channelMap.set(key, channel);
            //@ts-ignore use of protected property
            channel.removeChannel = this.removeChannelFromMap.bind(this);
            this.on('disconnected', (eventPayload: ProviderIdentity) => {
                if (eventPayload.channelName === channelName) {
                    this.removeChannelFromMap(key);
                    //@ts-ignore use of private property
                    channel.disconnectListener(eventPayload);
                }
            });
            return channel;
        } catch (e) {
            const shouldWait: boolean = Object.assign({ wait: true }, opts).wait;
            const internalNackMessage = 'internal-nack';
            if (shouldWait && e.message && e.message.includes(internalNackMessage)) {
                console.warn(`Channel not found for channelName: ${channelName}, waiting for channel creation.`);
                return await waitResponse;
            } else if (e.message === internalNackMessage) {
                throw new Error(`No channel found for channelName: ${channelName}`);
            } else {
                throw new Error(e);
            }
        }
    }

    public async create(channelName: string): Promise<ChannelProvider> {
        if (!channelName) {
            throw new Error('Please provide a channelName to create a channel');
        }
        const { payload: { data: providerIdentity } } = await this.wire.sendAction('create-channel', {channelName});
        const channel = new ChannelProvider(providerIdentity, this.wire.sendAction.bind(this.wire));
        const key = providerIdentity.channelId;
        this.channelMap.set(key, channel);
        //@ts-ignore use of protected property
        channel.removeChannel = this.removeChannelFromMap.bind(this);
        this.on('client-disconnected', (eventPayload: ProviderIdentity) => {
            if (eventPayload.channelName === channelName) {
                channel.connections = channel.connections.filter(identity => {
                    return identity.uuid !== eventPayload.uuid || identity.name !== eventPayload.name;
                });
                //@ts-ignore use of private property
                channel.disconnectListener(eventPayload);
            }
        });
        return channel;
    }

    protected removeChannelFromMap(mapKey: string) {
        this.channelMap.delete(mapKey);
    }

    public onmessage = (msg: ChannelMessage) => {
        if (msg.action === 'process-channel-message') {
            this.processChannelMessage(msg);
            return true;
        } else if (msg.action === 'process-channel-connection') {
            this.processChannelConnection(msg);
            return true;
        }
        return false;
    }
    private async processChannelMessage (msg: ChannelMessage) {
        const { senderIdentity, providerIdentity, action, ackToSender, payload } = msg.payload;
        const key = providerIdentity.channelId;
        const bus = this.channelMap.get(key);
        if (!bus) {
            ackToSender.payload.success = false;
            ackToSender.payload.reason = `Client connection with identity ${JSON.stringify(this.wire.me)} no longer connected.`;
            return this.wire.sendRaw(ackToSender);
        }
        try {
            const res = await bus.processAction(action, payload, senderIdentity);
            ackToSender.payload.payload = ackToSender.payload.payload || {};
            ackToSender.payload.payload.result = res;
            this.wire.sendRaw(ackToSender);
        } catch (e) {
            ackToSender.payload.success = false;
            ackToSender.payload.reason = e.message;
            this.wire.sendRaw(ackToSender);
        }
    }
    private async processChannelConnection (msg: ChannelMessage) {
        const { clientIdentity, providerIdentity, ackToSender, payload } = msg.payload;
        const key = providerIdentity.channelId;
        const bus = this.channelMap.get(key);
        if (!bus) {
            ackToSender.payload.success = false;
            ackToSender.payload.reason = `Channel "${providerIdentity.channelName}" has been destroyed.`;
            return this.wire.sendRaw(ackToSender);
        }
        try {
            if (!(bus instanceof ChannelProvider)) {
                throw Error('Cannot connect to a channel client');
            }
            const res = await bus.processConnection(clientIdentity, payload);
            ackToSender.payload.payload = ackToSender.payload.payload || {};
            ackToSender.payload.payload.result = res;
            this.wire.sendRaw(ackToSender);
        } catch (e) {
            ackToSender.payload.success = false;
            ackToSender.payload.reason = e.message;
            this.wire.sendRaw(ackToSender);
        }
    }
}
