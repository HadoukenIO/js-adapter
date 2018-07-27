import { EmitterBase, Base, Reply, RuntimeEvent } from '../base';
import { Identity } from '../../identity';
import { _Window } from '../window/window';
import { Point } from '../system/point';
import { MonitorInfo } from '../system/monitor';
import Transport from '../../transport/transport';
import Bounds from '../window/bounds';

export interface TrayIconClickReply extends Point, Reply<'application', 'tray-icon-clicked'> {
    button: number;
    monitorInfo: MonitorInfo;
}

export interface ApplicationInfo {
    launchMode: string;
}

export class NavigationRejectedReply extends Reply<'window-navigation-rejected', void> {
    public sourceName: string;
    public url: string;
}

export interface ConfigInterface {
    desktop?: boolean;
    startMenu?: boolean;
    systemStartup?: boolean;
}

export interface TrayInfo {
    bounds: Bounds;
    monitorInfo: MonitorInfo;
    x: number;
    y: number;
}

export default class ApplicationModule extends Base {
    /**
     * Returns an Application object that represents an existing application.
     * @param { Identity } indentity
     * @return {Promise.<Application>}
     * @tutorial Application.wrap
     */
    public wrap(identity: Identity): Promise<Application> {
        return Promise.resolve(new Application(this.wire, identity));
    }

    /**
     * Creates a new Application.
     * @param {*} appOptions
     * @return {Promise.<Application>}
     * @tutorial Application.create
     */
    public create(appOptions: any): Promise<Application> {
        return this.wire.sendAction('create-application', appOptions)
            .then(() => this.wrap({ uuid: appOptions.uuid }));
    }

    /**
     * Returns an Application object that represents the current application
     * @return {Promise.<Application>}
     * @tutorial Application.getCurrent
     */
    public getCurrent(): Promise<Application> {
        return this.wrap({ uuid: this.wire.me.uuid });
    }

    /**
     * Retrieves application's manifest and returns a wrapped application.
     * @param {string} manifestUrl - The URL of app's manifest.
     * @return {Promise.<Application>}
     * @tutorial Application.createFromManifest
     */
    public createFromManifest(manifestUrl: string): Promise<Application> {
        return this.wire.sendAction('get-application-manifest', {manifestUrl})
            .then(({ payload }) => this.wrap({uuid: payload.data.startup_app.uuid}));
    }
}

/**
 * @classdesc An object representing an application. Allows the developer to create,
 * execute, show/close an application as well as listen to application events.
 * @class
 */
 // @ts-ignore: return types incompatible with EventEmitter (this)
export class Application extends EmitterBase {
    private window: _Window;

    constructor(wire: Transport, public identity: Identity) {
        super(wire);

        this.window = new _Window(this.wire, {
            uuid: this.identity.uuid,
            name: this.identity.uuid
        });
    }

    protected runtimeEventComparator = (listener: RuntimeEvent): boolean => {
        return listener.topic === this.topic && listener.uuid === this.identity.uuid;
    }

    private windowListFromNameList(nameList: Array<string>): Array<_Window> {
        const windowList: Array<_Window> = [];
        nameList.forEach(name => {
            windowList.push(new _Window(this.wire, {
                uuid: <string>this.identity.uuid,
                name: name
            }));
        });

        return windowList;
    }

    /**
     * Determines if the application is currently running.
     * @return {Promise.<boolean>}
     * @tutorial Application.isRunning
     */
    public isRunning(): Promise<boolean> {
        return this.wire.sendAction('is-application-running', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Closes the application and any child windows created by the application.
     * @param { boolean } [force = false] Close will be prevented from closing when force is false and
     *  ‘close-requested’ has been subscribed to for application’s main window.
     * @return {Promise.<boolean>}
     * @tutorial Application.close
     */
    public close(force: boolean = false): Promise<void> {
        return this.wire.sendAction('close-application', Object.assign({}, this.identity, { force })).then(() => undefined);
    }

    /**
     * Retrieves an array of wrapped fin.Windows for each of the application’s child windows.
     * @return {Promise.Array.<_Window>}
     * @tutorial Application.getChildWindows
     */
    public getChildWindows(): Promise<Array<_Window>> {
        return this.wire.sendAction('get-child-windows', this.identity)
            .then(({ payload }) => this.windowListFromNameList(payload.data));
    }

    /**
     * Retrieves an array of active window groups for all of the application's windows. Each group is
     * represented as an array of wrapped fin.Windows.
     * @return {Promise.Array.Array.<_Window>}
     * @tutorial Application.getGroups
     */
    public getGroups(): Promise<Array<Array<_Window>>> {
        const winGroups: Array<Array<_Window>> = <Array<Array<_Window>>>[];
        return this.wire.sendAction('get-application-groups', this.identity)
            .then(({ payload }) => {
                payload.data.forEach((list: string[], index: number) => {
                    winGroups[index] = this.windowListFromNameList(list);
                });

                return winGroups;
            });
    }

    /**
     * Retrieves the JSON manifest that was used to create the application. Invokes the error callback
     * if the application was not created from a manifest.
     * @return {Promise.<any>}
     * @tutorial Application.getManifest
     */
    public getManifest(): Promise<any> {
        return this.wire.sendAction('get-application-manifest', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Retrieves UUID of the application that launches this application. Invokes the error callback
     * if the application was created from a manifest.
     * @return {Promise.<string>}
     * @tutorial Application.getParentUuid
     */
    public getParentUuid(): Promise<string> {
        return this.wire.sendAction('get-parent-application', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Retrieves current application's shortcut configuration.
     * @return {Promise.<ConfigInterface>}
     * @tutorial Application.getShortcuts
     */
    public getShortcuts(): Promise<ConfigInterface> {
        return this.wire.sendAction('get-shortcuts', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Returns an instance of the main Window of the application
     * @return {Promise.<_Window>}
     * @tutorial Application.getWindow
     */
    public getWindow(): Promise<_Window> {
        return Promise.resolve(this.window);
    }

    /**
    * Manually registers a user with the licensing service. The only data sent by this call is userName and appName.
    * @param { string } userName - username to be passed to the RVM.
    * @param { string } appName - app name to be passed to the RVM.
    * @return {Promise.<void>}
    * @tutorial Application.registerUser
    */
    public registerUser(userName: string, appName: string): Promise<void> {
        return this.wire.sendAction('register-user', Object.assign({}, this.identity, {userName, appName})).then(() => undefined);
    }

    /**
     * Removes the application’s icon from the tray.
     * @return {Promise.<void>}
     * @tutorial Application.removeTrayIcon
     */
    public removeTrayIcon(): Promise<void> {
        return this.wire.sendAction('remove-tray-icon', this.identity).then(() => undefined);
    }

    /**
     * Restarts the application.
     * @return {Promise.<void>}
     * @tutorial Application.restart
     */
    public restart(): Promise<void> {
        return this.wire.sendAction('restart-application', this.identity).then(() => undefined);
    }

    /**
     * Runs the application. When the application is created, run must be called.
     * @return {Promise.<void>}
     * @tutorial Application.run
     */
    public run(): Promise<void> {
        return this.wire.sendAction('run-application', this.identity).then(() => undefined);
    }

    /**
     * Instructs the RVM to schedule one restart of the application.
     * @return {Promise.<void>}
     * @tutorial Application.scheduleRestart
     */
    public scheduleRestart(): Promise<void> {
        return this.wire.sendAction('relaunch-on-close', this.identity).then(() => undefined);
    }

    /**
     * Adds a customizable icon in the system tray and notifies the application when clicked.
     * @param { string } iconUrl Image URL to be used as the icon
     * @return {Promise.<void>}
     * @tutorial Application.setTrayIcon
     */
    public setTrayIcon(iconUrl: string): Promise<void> {
        return this.wire.sendAction('set-tray-icon', Object.assign({}, this.identity, {
            enabledIcon: iconUrl
        })).then(() => undefined);
    }

    /**
     * Sets new application's shortcut configuration.
     * @param { Object } config New application's shortcut configuration.
     * @param {Boolean} [config.desktop] - Enable/disable desktop shortcut.
     * @param {Boolean} [config.startMenu] - Enable/disable start menu shortcut.
     * @param {Boolean} [config.systemStartup] - Enable/disable system startup shortcut.
     * @return {Promise.<void>}
     * @tutorial Application.setShortcuts
     */
    public setShortcuts(config: ConfigInterface): Promise<void> {
        return this.wire.sendAction('set-shortcuts', Object.assign({}, this.identity, {data: config})
               ).then(() => undefined);
    }

    /**
     * @summary Retrieves information about the system tray.
     * @desc The only information currently returned is the position and dimensions.
     * @return {Promise.<TrayInfo>}
     * @tutorial Application.getTrayIconInfo
     */
    public getTrayIconInfo(): Promise<TrayInfo> {
        return this.wire.sendAction('get-tray-icon-info', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Closes the application by terminating its process.
     * @return {Promise.<void>}
     * @tutorial Application.terminate
     */
    public terminate(): Promise<void> {
        return this.wire.sendAction('terminate-application', this.identity).then(() => undefined);
    }

    /**
     * Waits for a hanging application. This method can be called in response to an application
     * "not-responding" to allow the application to continue and to generate another "not-responding"
     * message after a certain period of time.
     * @return {Promise.<void>}
     * @ignore
     */
    public wait(): Promise<void> {
        return this.wire.sendAction('wait-for-hung-application', this.identity).then(() => undefined);
    }

    /**
     * Retrieves information about the application.
     * message after a certain period of time.
     * @return {Promise.<ApplicationInfo>}
     * @tutorial Application.getInfo
     */
    public getInfo(): Promise<ApplicationInfo> {
        return this.wire.sendAction('get-info', this.identity).then(({ payload }) => payload.data);
    }

}

// @ts-ignore: return types incompatible with EventEmitter (this)
export interface Application {
    on(type: 'closed', listener: (data: Reply<'application', 'closed'>) => void): Promise<void>;
    on(type: 'initialized', listener: (data: Reply<'application', 'initialized'>) => void): Promise<void>;
    on(type: 'connected', listener: (data: Reply<'application', 'connected'>) => void): Promise<void>;
    on(type: 'crashed', listener: (data: Reply<'application', 'crashed'>) => void): Promise<void>;
    on(type: 'error', listener: (data: Reply<'application', 'error'>) => void): Promise<void>;
    on(type: 'not-responding', listener: (data: Reply<'application', 'not-responding'>) => void): Promise<void>;
    on(type: 'out-of-memory', listener: (data: Reply<'application', 'out-of-memory'>) => void): Promise<void>;
    on(type: 'responding', listener: (data: Reply<'application', 'responding'>) => void): Promise<void>;
    on(type: 'started', listener: (data: Reply<'application', 'started'>) => void): Promise<void>;
    on(type: 'run-requested', listener: (data: Reply<'application', 'run-requested'>) => void): Promise<void>;
    on(type: 'window-navigation-rejected', listener: (data: NavigationRejectedReply) => void): Promise<void>;
    on(type: 'window-created', listener: (data: Reply<'application', 'window-created'>) => void): Promise<void>;
    on(type: 'window-closed', listener: (data: Reply<'application', 'window-closed'>) => void): Promise<void>;
    on(type: 'tray-icon-clicked', listener: (data: TrayIconClickReply) => void): Promise<void>;
    on(type: 'removeListener', listener: (eventType: string) => void): Promise<void>;
    on(type: 'newListener', listener: (eventType: string) => void): Promise<void>;
}
