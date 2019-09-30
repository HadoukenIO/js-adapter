import { BaseEventMap, WindowEvent } from './base';
import { CrashedEvent } from './application';

export interface WindowResourceLoadFailedEvent<Topic, Type> extends WindowEvent<Topic, Type> {
    errorCode: number;
    errorDescription: string;
    validatedURL: string;
    isMainFrame: boolean;
}

export interface WindowResourceResponseReceivedEvent<Topic, Type> extends WindowEvent<Topic, Type> {
    status: boolean;
    newUrl: string;
    originalUrl: string;
    httpResponseCode: number;
    requestMethod: string;
    referrer: string;
    headers: any;
    resourceType: 'mainFrame' | 'subFrame' | 'styleSheet' | 'script' | 'image' | 'object' | 'xhr' | 'other';
}

export interface WebContentsEventMapping<Topic = string, Type = string> extends BaseEventMap {
    'resource-load-failed': WindowResourceLoadFailedEvent<Topic, Type>;
    'resource-response-received': WindowResourceResponseReceivedEvent<Topic, Type>;
    'did-change-theme-color': WindowEvent<Topic, Type>;
    'page-favicon-updated': WindowEvent<Topic, Type>;
    'page-title-updated': WindowEvent<Topic, Type>;
    'crashed': CrashedEvent & WindowEvent<Topic, Type>;
}