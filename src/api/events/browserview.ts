import { WebContentsEventMapping } from './webcontents';
import { WindowEvent } from './base';

export interface ViewEventMapping<Topic = string, Type = string> extends WebContentsEventMapping {
    'attached': WindowEvent<Topic, Type>;
    'crashed': WindowEvent<Topic, Type>;
    'created': WindowEvent<Topic, Type>;
    'did-change-theme-color': WindowEvent<Topic, Type>;
    'destroyed': WindowEvent<Topic, Type>;
    'hidden': WindowEvent<Topic, Type>;
    'page-favicon-updated': WindowEvent<Topic, Type>;
    'page-title-updated': WindowEvent<Topic, Type>;
    'shown': WindowEvent<Topic, Type>;
}

export type ViewEvents = {
    [Type in keyof ViewEventMapping]: ViewEventMapping<'view', Type>[Type];
};