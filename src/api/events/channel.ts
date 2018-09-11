import { BaseEventMap, BaseEvent } from './base';

export interface ChannelEvents extends BaseEventMap {
    'connected': BaseEvent<'channel', 'connected'>;
    'disconnected': BaseEvent<'channel', 'disconnected'>;
}