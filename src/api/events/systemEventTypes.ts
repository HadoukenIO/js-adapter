import { BaseEvent, ApplicationEvent } from './base';
import { MonitorInfo } from '../system/monitor';
import { PropagatedWindowEvents } from './windowEventTypes';
import { PropagatedApplicationEvents } from './applicationEventTypes';

export interface IdleEvent<Topic, Type> extends BaseEvent<Topic, Type> {
    elapsedTime: number;
    isIdle: boolean;
}

export type MonitorEvent<Topic, Type> = MonitorInfo & BaseEvent<Topic, Type>;

export interface SessionChangedEvent<Topic, Type> extends BaseEvent<Topic, Type> {
    reason: 'lock'| 'unlock' | 'remote-connect' | 'remote-disconnect' | 'unknown';
}

export interface SystemEventMapping<Topic = string, Type = string> {
    'application-created': ApplicationEvent<Topic, Type>;
    'desktop-icon-clicked': ApplicationEvent<Topic, Type>;
    'idle-state-changed': IdleEvent<Topic, Type>;
    'monitor-info-changed': MonitorEvent<Topic, Type>;
    'session-changed': SessionChangedEvent<Topic, Type>;
}
export type SystemEvents = PropagatedWindowEvents<'system'>
    & PropagatedApplicationEvents<'system'>
    & {
        [Type in keyof SystemEventMapping]: SystemEventMapping<'system', Type>[Type];
    };
