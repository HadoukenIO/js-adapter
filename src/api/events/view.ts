import { WebContentsEventMapping } from './webcontents';
import { WindowEvent, BaseEventMap } from './base';

export interface ViewEventMapping<Topic = string, Type = string> extends WebContentsEventMapping {
    'attached': WindowEvent<Topic, Type>;
    'created': WindowEvent<Topic, Type>;
    'destroyed': WindowEvent<Topic, Type>;
    'hidden': WindowEvent<Topic, Type>;
    'shown': WindowEvent<Topic, Type>;
}

export interface PropagatedViewEventMapping<Topic = string, Type = string> extends BaseEventMap {
    'view-created': WindowEvent<Topic, Type>;
    'view-attached': WindowEvent<Topic, Type>;
    'view-shown': WindowEvent<Topic, Type>;
    'view-hidden': WindowEvent<Topic, Type>;
    'view-destroyed': WindowEvent<Topic, Type>;
}

export type ViewEvents = {
    [Type in keyof ViewEventMapping]: ViewEventMapping<'view', Type>[Type];
};

export type PropagatedViewEvents<Topic> = {
    [Type in keyof PropagatedViewEventMapping]: PropagatedViewEventMapping<Topic, Type>[Type]
};