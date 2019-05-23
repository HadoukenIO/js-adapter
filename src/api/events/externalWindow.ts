import { WindowEvent, BaseEventMap } from './base';
import { WindowBeginBoundsChangingEvent, WindowBoundsChange, WindowGroupChanged, WindowHiddenEvent} from './window';

export interface ExternalWindowEventMapping<Topic = string, Type = string> extends BaseEventMap {
    'begin-user-bounds-changing': WindowBeginBoundsChangingEvent<Topic, Type>;
    'blurred': WindowEvent<Topic, Type>;
    'bounds-changed': WindowBoundsChange<Topic, Type>;
    'bounds-changing': WindowBoundsChange<Topic, Type>;
    'closed': WindowEvent<Topic, Type>;
    'closing': WindowEvent<Topic, Type>;
    'disabled-movement-bounds-changed': WindowBoundsChange<Topic, Type>;
    'disabled-movement-bounds-changing': WindowBoundsChange<Topic, Type>;
    'end-user-bounds-changing': WindowBeginBoundsChangingEvent<Topic, Type>;
    'focused': WindowEvent<Topic, Type>;
    'group-changed': WindowGroupChanged<Topic, Type>;
    'hidden': WindowHiddenEvent<Topic, Type>;
    'maximized': WindowEvent<Topic, Type>;
    'minimized': WindowEvent<Topic, Type>;
    'restored': WindowEvent<Topic, Type>;
    'shown': WindowEvent<Topic, Type>;
    'user-movement-disabled': WindowEvent<Topic, Type>;
    'user-movement-enabled': WindowEvent<Topic, Type>;
}

export type ExternalWindowEvents = {
    [Type in keyof ExternalWindowEventMapping]: ExternalWindowEventMapping<'external-window', Type>[Type];
};