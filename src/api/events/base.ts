import { Identity } from '../../identity';
import { FrameEvent } from './frame';

//This file exports base event types to level specific events
//Those files map event names to event shapes and use a mapped type to specify topic and type
export type RuntimeEvent<Topic = string, Type = string> =
    Topic extends 'window' ? WindowEvent<Topic, Type> :
    Topic extends 'frame' ? FrameEvent<Type> :
    Topic extends 'application' ? ApplicationEvent<Topic, Type>:
    Topic extends 'external-window' ? ApplicationEvent<Topic, Type>:
    BaseEvent<Topic, Type>;

export interface BaseEvent<Topic, Type> {
    topic: Topic;
    type: Type;
}
export interface ApplicationEvent<Topic, Type> extends BaseEvent<Topic, Type> {
    uuid: string;
}
export interface WindowEvent<Topic, Type> extends ApplicationEvent<Topic, Type> {
    name: string;
}

export interface ExternalWindowEvent<Topic, Type> extends BaseEvent<Topic, Type>, Identity {}

export function getTopic(e: RuntimeEvent<any>)  {
    switch (e.topic) {
        case 'window':
            return 'window';
    }
}

export interface BaseEventMap {
    [name: string]: any;
    'newListener': string;
    'listenerRemoved': string;
}
