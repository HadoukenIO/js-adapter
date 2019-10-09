import { WebContentsEventMapping, WindowResourceLoadFailedEvent, WindowResourceResponseReceivedEvent } from './webcontents';
import { WindowEvent, BaseEventMap } from './base';
import { CrashedEvent } from './application';

export interface ViewEventMapping<Topic = string, Type = string> extends WebContentsEventMapping {
    'attached': WindowEvent<Topic, Type>;
    'created': WindowEvent<Topic, Type>;
    'destroyed': WindowEvent<Topic, Type>;
    'detached': WindowEvent<Topic, Type>;
    'hidden': WindowEvent<Topic, Type>;
    'shown': WindowEvent<Topic, Type>;
}

export interface PropagatedViewEventMapping<Topic = string, Type = string> extends BaseEventMap {
    'view-attached': WindowEvent<Topic, Type>;
    'view-crashed': CrashedEvent & WindowEvent<Topic, Type>;
    'view-created': WindowEvent<Topic, Type>;
    'view-destroyed': WindowEvent<Topic, Type>;
    'view-detached': WindowEvent<Topic, Type>;
    'view-did-change-theme-color': WindowEvent<Topic, Type>;
    'view-hidden': WindowEvent<Topic, Type>;
    'view-page-favicon-updated': WindowEvent<Topic, Type>;
    'view-page-title-updated': WindowEvent<Topic, Type>;
    'view-resource-load-failed': WindowResourceLoadFailedEvent<Topic, Type>;
    'view-resource-response-received': WindowResourceResponseReceivedEvent<Topic, Type>;
    'view-shown': WindowEvent<Topic, Type>;
}

export type ViewEvents = {
    [Type in keyof ViewEventMapping]: ViewEventMapping<'view', Type>[Type];
};

export type PropagatedViewEvents<Topic> = {
    [Type in keyof PropagatedViewEventMapping]: PropagatedViewEventMapping<Topic, Type>[Type]
};