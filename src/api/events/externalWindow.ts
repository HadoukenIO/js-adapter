import { ExternalWindowEvent, BaseEventMap } from './base';

export interface ExternalWindowEventMapping<Topic = string, Type = string> extends BaseEventMap {
    'opened': ExternalWindowEvent<Topic, Type>;
    'closed': ExternalWindowEvent<Topic, Type>;
}
export type ExternalWindowEvents = {
    [Type in keyof ExternalWindowEventMapping]: ExternalWindowEventMapping<'external-window', Type>[Type];
};
