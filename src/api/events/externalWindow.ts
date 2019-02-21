import { ExternalWindowEvent, BaseEventMap } from './base';

export interface ExternalWindowEventMapping<Topic = string, Type = string> extends BaseEventMap {
    'begin-user-bounds-changing': ExternalWindowEvent<Topic, Type>;
    'bounds-changed': ExternalWindowEvent<Topic, Type>;
    'bounds-changing': ExternalWindowEvent<Topic, Type>;
    'closed': ExternalWindowEvent<Topic, Type>;
    'end-user-bounds-changing': ExternalWindowEvent<Topic, Type>;
    'focused': ExternalWindowEvent<Topic, Type>;
    'hidden': ExternalWindowEvent<Topic, Type>;
    'maximized': ExternalWindowEvent<Topic, Type>;
    'minimized': ExternalWindowEvent<Topic, Type>;
    'restored': ExternalWindowEvent<Topic, Type>;
    'shown': ExternalWindowEvent<Topic, Type>;
}
export type ExternalWindowEvents = {
    [Type in keyof ExternalWindowEventMapping]: ExternalWindowEventMapping<'external-window', Type>[Type];
};
