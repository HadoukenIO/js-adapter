import { WindowEvent, WindowAuthRequestedEvent, WindowAlertRequestedEvent,
     WindowEndLoadEvent, WindowNavigationRejectedEvent, WindowReloadedEvent } from './windowEventTypes';

export interface Event {
    uuid: string;
    topic: string;
    type: string;
}

export interface CrashedEvent extends Event {
    reason: 'normal-termination' | 'abnormal-termination' | 'killed' | 'crashed' | 'still-running' | 'launch-failed' | 'out-of-memory';
}

export interface RunRequestedEvent extends Event {
    userAppConfigArgs: any;
}

export interface TrayIconClicked extends Event {
    button: 0 | 1 | 2;
    x: number;
    y: number;
    monitorInfo: any;
}

export interface ApplicationEventTypes {
    'closed': Event;
    'connected': Event;
    'initialized': Event;
    'manifest-changed': Event;
    'not-responding': Event;
    'responding': Event;
    'started': Event;
    'window-blurred': WindowEvent;
    'window-closed': WindowEvent;
    'window-closing': WindowEvent;
    'window-created': WindowEvent;
    'window-focused': WindowEvent;
    'window-not-responding': WindowEvent;
    'window-responding': WindowEvent;
    'window-show-requested': WindowEvent;
    'window-start-load': WindowEvent;
    'crashed': CrashedEvent;
    'run-requested': RunRequestedEvent;
    'tray-icon-clicked': TrayIconClicked;
    'window-alert-requested': WindowAlertRequestedEvent;
    'window-auth-requested': WindowAuthRequestedEvent;
    'window-crashed': CrashedEvent & WindowEvent;
    'window-end-load': WindowEndLoadEvent;
    'window-navigation-rejected': WindowNavigationRejectedEvent;
    'window-reloaded': WindowReloadedEvent;
}