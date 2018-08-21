import { ChannelClient } from './client';
import { Identity } from '../../../identity';
import { ChannelProvider } from './provider';
import { EmitterBase } from '../../base';
import Transport, { Message, Payload } from '../../../transport/transport';
import { ProviderIdentity } from './channel';

export interface Options {
    wait?: boolean;
    uuid: string;
    name?: string;
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
        super(wire, ['channel']);
        this.topic = 'channel';
        this.channelMap = new Map();
        wire.registerMessageHandler(this.onmessage.bind(this));
    }

    public async getAllChannels(): Promise<ProviderIdentity[]> {
        return this.wire.sendAction('get-all-channels')
            .then(({ payload }) => payload.data);
    }

    public async onChannelConnect(listener: Function): Promise<void> {
        await this.on('channel-connected', (payload) => {
            const eventPayload = Object.assign(payload, {type: 'connected'});
            listener(eventPayload);
        });
    }

    public async onChannelDisconnect(listener: Function): Promise<void> {
        await this.on('channel-disconnected', (payload) => {
            const eventPayload = Object.assign(payload, {type: 'disconnected'});
            listener(eventPayload);
        });
    }

    // DOCS - if want to send payload, put payload in options
    public async connect(options: Options): Promise<ChannelClient> {
        const { uuid, name } = options;
        let resolver: any;
        let listener: any;
        //@ts-ignore
        // tslint:disable-next-line
        const waitResponse: Promise<ChannelClient> = new Promise(resolve => {
            resolver = resolve;
            listener = (payload: any) => {
                // Will need to be improved for uuid/name combo and channelName
                if (uuid === payload.uuid) {
                    this.connect(options).then(response => {
                        resolve(response);
                        this.removeListener('channel-connected', listener);
                    });
                }
            };
            this.on('channel-connected', listener);
        });
        try {
            const { payload: { data: providerIdentity } } = await this.wire.sendAction('connect-to-channel', options);
            if (resolver) {
                resolver();
            }
            this.removeListener('channel-connected', listener);
            const channel = new ChannelClient(providerIdentity, this.wire.sendAction.bind(this.wire));
            const key = providerIdentity.channelId || providerIdentity.uuid;
            this.channelMap.set(key, channel);
            return channel;
        } catch (e) {
            const shouldWait: boolean = Object.assign({ wait: true }, options).wait;
            const internalNackMessage = 'internal-nack';
            if (shouldWait && e.message === internalNackMessage) {
                return await waitResponse;
            } else if (e.message === internalNackMessage) {
                throw new Error('No channel found');
            } else {
                throw new Error(e);
            }
        }
    }

    public async create(channelName?: string): Promise<ChannelProvider> {
        const { payload: { data: providerIdentity } } = await this.wire.sendAction('create-channel', {channelName});
        const channel = new ChannelProvider(providerIdentity, this.wire.sendAction.bind(this.wire));
        const key = providerIdentity.channelId || providerIdentity.uuid;
        this.channelMap.set(key, channel);
        return channel;
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
            return;
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
            return;
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

interface PluginSubscribeSuccess {
    uuid: string;
    name: string;
    serviceName: string;
}
