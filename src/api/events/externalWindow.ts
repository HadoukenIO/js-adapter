import { ExternalWindowEvent, BaseEventMap } from './base';

export interface ExternalWindowEventMapping<Topic = string, Type = string> extends BaseEventMap {
    'begin-user-bounds-changing': ExternalWindowEvent<Topic, Type>;
    'bounds-changed': ExternalWindowEvent<Topic, Type>;
    'bounds-changing': ExternalWindowEvent<Topic, Type>;
    'closed': ExternalWindowEvent<Topic, Type>;
    'disabled-frame-bounds-changed': ExternalWindowEvent<Topic, Type>;
    'disabled-frame-bounds-changing': ExternalWindowEvent<Topic, Type>;
    'focused': ExternalWindowEvent<Topic, Type>;
    'frame-disabled': ExternalWindowEvent<Topic, Type>;
    'frame-enabled': ExternalWindowEvent<Topic, Type>;
    'group-changed': ExternalWindowEvent<Topic, Type>;
    'hidden': ExternalWindowEvent<Topic, Type>;
    'maximized': ExternalWindowEvent<Topic, Type>;
    'minimized': ExternalWindowEvent<Topic, Type>;
    'restored': ExternalWindowEvent<Topic, Type>;
    'shown': ExternalWindowEvent<Topic, Type>;
}
export type ExternalWindowEvents = {
    [Type in keyof ExternalWindowEventMapping]: ExternalWindowEventMapping<'external-window', Type>[Type];
};
