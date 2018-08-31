import { CrashedEvent } from './applicationEventTypes';

export interface WindowEvent extends Event {
    name: string;
}

export interface WindowAlertRequestedEvent extends WindowEvent {
    message: string;
    url: string;
}

export interface WindowAuthRequestedEvent extends WindowEvent {
    authInfo: any;
}

export interface WindowEndLoadEvent extends WindowEvent {
    documentName: string;
    isMain: boolean;
}

export interface WindowNavigationRejectedEvent extends WindowEvent {
    sourceName: string;
    url: string;
}

export interface WindowReloadedEvent extends WindowEvent {
    url: string;
}

export interface WindowExternalProcessExitedEvent extends WindowEvent {
    processUuid: string;
    exitCode: number;
}

export interface WindowExternalProcessStartedEvent extends WindowEvent {
    processUuid: string;
}

export interface WindowHiddenEvent extends WindowEvent {
    reason: 'closing' | 'hide' | 'hide-on-close';
}

export interface WindowPreloadScriptsStateChangeEvent extends WindowEvent {
    preloadScripts: Array<Object>;
}

export interface WindowResourceLoadFailedEvent extends WindowEvent {
    errorCode: number;
    errorDescription: string;
    validatedURL: string;
    isMainFrame: boolean;
}

export interface WindowResourceResponseReceivedEvent extends WindowEvent {
    status: boolean;
    newUrl: string;
    originalUrl: string;
    httpResponseCode: number;
    requestMethod: string;
    referrer: string;
    headers: Object;
    resourceType: 'mainFrame' | 'subFrame' | 'styleSheet' | 'script' | 'image' | 'object' | 'xhr' | 'other';
}

export interface WindowBeginBoundsChangingEvent extends WindowEvent {
    height: number;
    left: number;
    top: number;
    width: number;
    windowState: 'minimized' | 'normal' | 'maximized';
}

export interface WindowBoundsChange extends WindowEvent {
    changeType: 0 | 1 | 2;
    deferred: boolean;
    height: number;
    left: number;
    top: number;
    width: number;
}

export interface WindowGroupChanged extends WindowEvent {
    memberOf: 'source' | 'target' | 'nothing';
    reason: 'leave' | 'join' | 'merge' | 'disband';
    sourceGroup: Array<{
        appUuid: string;
        windowName: string;
    }>;
    sourceWindowAppUuid: string;
    sourceWindowName: string;
    targetGroup: Array<{
        appUuid: string;
        windowName: string;
    }>;
    targetWindowAppUuid: string;
    targetWindowName: string;
}

export interface WindowEventTypes {
    'auth-requested': WindowAuthRequestedEvent,
    'begin-user-bounds-changing': WindowBeginBoundsChangingEvent,
    'blurred': WindowEvent,
    'bounds-changed': WindowBoundsChange;
    'bounds-changing': WindowBoundsChange;
    'close-requested': WindowEvent,
    'closed': WindowEvent,
    'closing': WindowEvent,
    'crashed': CrashedEvent & WindowEvent,
    'disabled-frame-bounds-changed': WindowBoundsChange;
    'disabled-frame-bounds-changing': WindowBoundsChange;
    'embedded': WindowEvent,
    'end-user-bounds-changing': WindowBeginBoundsChangingEvent,
    'external-process-exited': WindowExternalProcessExitedEvent,
    'external-process-started': WindowExternalProcessStartedEvent,
    'focused': WindowEvent,
    'frame-disabled': WindowEvent,
    'frame-enabled': WindowEvent,
    'group-changed': WindowGroupChanged;
    'hidden': WindowHiddenEvent,
    'initialized': WindowEvent,
    'maximized': WindowEvent,
    'minimized': WindowEvent,
    'navigation-rejected': WindowNavigationRejectedEvent,
    'preload-scripts-state-changed': WindowPreloadScriptsStateChangeEvent,
    'preload-scripts-state-changing': WindowPreloadScriptsStateChangeEvent,
    'resource-load-failed': WindowResourceLoadFailedEvent,
    'resource-response-received': WindowResourceResponseReceivedEvent,
    'reloaded': WindowReloadedEvent,
    'restored': WindowEvent,
    'show-requested': WindowEvent,
    'shown': WindowEvent
}