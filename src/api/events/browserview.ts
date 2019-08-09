import { WebContentsEventMapping } from "./webcontents";
import { WindowEvent } from "./base";

export interface ViewEventMapping<Topic = string, Type = string> extends WebContentsEventMapping {
    // 'attached': WindowEvent<Topic,Type>;
    // 'destroyed': WindowEvent<Topic, Type>;
}

export type ViewEvents = {
    [Type in keyof ViewEventMapping]: ViewEventMapping<'view', Type>[Type];
};