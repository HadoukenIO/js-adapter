import { EmitterBase, Base, Reply, SubOptions } from '../base';
import { Identity } from '../../identity';
import { _Window } from '../window/window';
import { Point } from '../system/point';
import { MonitorInfo } from '../system/monitor';
import Transport from '../../transport/transport';
import Bounds from '../window/bounds';
import { ApplicationEvents } from '../events/application';
import { ApplicationOption } from './applicationOption';

export interface TrayIconClickReply extends Point, Reply<'application', 'tray-icon-clicked'> {
    button: number;
    monitorInfo: MonitorInfo;
}

export interface ApplicationInfo {
    initialOptions: object;
    launchMode: string;
    manifest: object;
    manifestUrl: string;
    parentUuid?: string;
    runtime: object;
}

export interface LogInfo {
    logId: string;
}

export class NavigationRejectedReply extends Reply<'window-navigation-rejected', void> {
    public sourceName: string;
    public url: string;
}

export interface ShortCutConfig {
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

/**
 * @typedef {object} Application~options
 * @summary Application creation options.
 * @desc This is the options object required by {@link Application.create Application.create}.
 *
 * The following options are required:
 * * `uuid` is required in the app manifest as well as by {@link Application.create Application.create}
 * * `name` is optional in the app manifest but required by {@link Application.create Application.create}
 * * `url` is optional in both the app manifest {@link Application.create Application.create} and  but is usually given
 * (defaults to `"about:blank"` when omitted).
 *
 * _This jsdoc typedef mirrors the `ApplicationOptions` TypeScript interface in `@types/openfin`._
 *
 * **IMPORTANT NOTE:**
 * This object inherits all the properties of the window creation {@link Window~options options} object,
 * which will take priority over those of the same name that may be provided in `mainWindowOptions`.
 *
 * @property {boolean} [disableIabSecureLogging=false]
 * When set to `true` it will disable IAB secure logging for the app.
 *
 * @property {string} [loadErrorMessage="There was an error loading the application."]
 * An error message to display when the application (launched via manifest) fails to load.
 * A dialog box will be launched with the error message just before the runtime exits.
 * Load fails such as failed DNS resolutions or aborted connections as well as cancellations, _e.g.,_ `window.stop()`,
 * will trigger this dialog.
 * Client response codes such as `404 Not Found` are not treated as fails as they are valid server responses.
 *
 * @property {Window~options} [mainWindowOptions]
 * The options of the main window of the application.
 * For a description of these options, click the link (in the Type column).
 *
 * @property {string} [name]
 * The name of the application (and the application's main window).
 *
 * If provided, _must_ match `uuid`.
 *
 * @property {boolean} [nonPersistent=false]
 * A flag to configure the application as non-persistent.
 * Runtime exits when there are no persistent apps running.
 *
 * @property {boolean} [plugins=false]
 * Enable Flash at the application level.
 *
 * @property {boolean} [spellCheck=false]
 * Enable spell check at the application level.
 *
 * @property {string} [url="about:blank"]
 * The url to the application (specifically the application's main window).
 *
 * @property {string} uuid
 * The _Unique Universal Identifier_ (UUID) of the application, unique within the set of all other applications
 *  running in the OpenFin Runtime.
 *
 * Note that `name` and `uuid` must match.
 *
 * @property {boolean} [webSecurity=true]
 * When set to `false` it will disable the same-origin policy for the app.
 */

/**
 * @lends Application
 */
export default class ApplicationModule extends Base {
    /**
     * Asynchronously returns an Application object that represents an existing application.
     * @param { Identity } identity
     * @return {Promise.<Application>}
     * @tutorial Application.wrap
     * @static
     */
    public wrap(identity: Identity): Promise<Application> {
        return Promise.resolve(new Application(this.wire, identity));
    }

    /**
     * Synchronously returns an Application object that represents an existing application.
     * @param { Identity } identity
     * @return {Application}
     * @tutorial Application.wrapSync
     * @static
     */
    public wrapSync(identity: Identity): Application {
        return new Application(this.wire, identity);
    }
    // tslint:disable-next-line:function-name
    private async _create(appOptions: ApplicationOption): Promise<Application> {
        //set defaults:
        if (appOptions.waitForPageLoad === void 0) {
            appOptions.waitForPageLoad = false;
        }
        if (appOptions.autoShow === void 0) {
            appOptions.autoShow = true;
        }
        await this.wire.sendAction('create-application', appOptions);
        return await this.wrap({ uuid: appOptions.uuid });
    }
    public create(appOptions: ApplicationOption): Promise<Application> {
        console.warn('Deprecation Warning: fin.Application.create is deprecated. Please use fin.Application.start');
        return this._create(appOptions);
    }
    /**
    * Creates and starts a new Application.
    * @param { ApplicationOption } appOptions
    * @return {Promise.<Application>}
    * @tutorial Application.start
    * @static
    */
    public async start(appOptions: ApplicationOption): Promise<Application> {
        const app = await this._create(appOptions);
        await this.wire.sendAction('run-application', { uuid: appOptions.uuid });
        return app;
    }

    /**
     * Asynchronously returns an Application object that represents the current application
     * @return {Promise.<Application>}
     * @tutorial Application.getCurrent
     * @static
     */
    public getCurrent(): Promise<Application> {
        return this.wrap({ uuid: this.wire.me.uuid });
    }

    /**
     * Synchronously returns an Application object that represents the current application
     * @return {Application}
     * @tutorial Application.getCurrentSync
     * @static
     */
    public getCurrentSync(): Application {
        return this.wrapSync({ uuid: this.wire.me.uuid });
    }

    /**
     * Retrieves application's manifest and returns a running instance of the application.
     * @param {string} manifestUrl - The URL of app's manifest.
     * @return {Promise.<Application>}
     * @tutorial Application.startFromManifest
     * @static
     */
    public async startFromManifest(manifestUrl: string): Promise<Application> {
        const app = await this._createFromManifest(manifestUrl);
        //@ts-ignore using private method without warning.
        await app._run();
        return app;
    }
    public createFromManifest(manifestUrl: string): Promise<Application> {
        console.warn('Deprecation Warning: fin.Application.createFromManifest is deprecated. Please use fin.Application.startFromManifest');
        return this._createFromManifest(manifestUrl);
    }
    // tslint:disable-next-line:function-name
    private _createFromManifest(manifestUrl: string): Promise<Application> {
        return this.wire.sendAction('get-application-manifest', { manifestUrl })
            .then(({ payload }) => this.wrap({ uuid: payload.data.startup_app.uuid })
                .then(app => {
                    app._manifestUrl = manifestUrl;
                    return app;
                }));
    }
}

/**
 * @classdesc An object representing an application. Allows the developer to create,
 * execute, show/close an application as well as listen to <a href="tutorial-Application.EventEmitter.html">application events</a>.
 * @class
 * @hideconstructor
 */
export class Application extends EmitterBase<ApplicationEvents> {
    public _manifestUrl?: string;
    private window: _Window;

    constructor(wire: Transport, public identity: Identity) {
        super(wire, ['application', identity.uuid]);

        this.window = new _Window(this.wire, {
            uuid: this.identity.uuid,
            name: this.identity.uuid
        });
    }

    private windowListFromIdentityList(identityList: Array<Identity>): Array<_Window> {
        const windowList: Array<_Window> = [];
        identityList.forEach(identity => {
            windowList.push(new _Window(this.wire, {
                uuid: identity.uuid,
                name: identity.name
            }));
        });

        return windowList;
    }

    /**
     * Adds a listener to the end of the listeners array for the specified event.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - Called whenever an event of the specified type occurs.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @function addListener
     * @memberof Application
     * @instance
     * @tutorial Application.EventEmitter
     */

    /**
     * Adds a listener to the end of the listeners array for the specified event.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - Called whenever an event of the specified type occurs.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @function on
     * @memberof Application
     * @instance
     * @tutorial Application.EventEmitter
     */

    /**
     * Adds a one time listener for the event. The listener is invoked only the first time the event is fired, after which it is removed.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - The callback function.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @function once
     * @memberof Application
     * @instance
     * @tutorial Application.EventEmitter
     */

    /**
     * Adds a listener to the beginning of the listeners array for the specified event.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - The callback function.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @function prependListener
     * @memberof Application
     * @instance
     * @tutorial Application.EventEmitter
     */

    /**
     * Adds a one time listener for the event. The listener is invoked only the first time the event is fired, after which it is removed.
     * The listener is added to the beginning of the listeners array.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - The callback function.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @function prependOnceListener
     * @memberof Application
     * @instance
     * @tutorial Application.EventEmitter
     */

    /**
     * Remove a listener from the listener array for the specified event.
     * Caution: Calling this method changes the array indices in the listener array behind the listener.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - The callback function.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @function removeListener
     * @memberof Application
     * @instance
     * @tutorial Application.EventEmitter
     */

    /**
     * Removes all listeners, or those of the specified event.
     * @param { string | symbol } [eventType]  - The type of the event.
     * @return {Promise.<this>}
     * @function removeAllListeners
     * @memberof Application
     * @instance
     * @tutorial Application.EventEmitter
     */

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
     * Cleans the application from state so it is no longer found in getAllApplications.
     * @param { boolean } [force = false] Close will be prevented from closing when force is false and
     *  ‘close-requested’ has been subscribed to for application’s main window.
     * @return {Promise.<boolean>}
     * @tutorial Application.quit
     */
    public async quit(force: boolean = false): Promise<void> {
        await this._close(force);
        await this.wire.sendAction('destroy-application', Object.assign({force}, this.identity));
    }
    //tslint:disable-next-line:function-name
    private _close(force: boolean = false): Promise<void> {
        return this.wire.sendAction('close-application', Object.assign({}, this.identity, { force })).then(() => undefined);
    }
    public close(force: boolean = false): Promise<void> {
        console.warn('Deprecation Warning: Application.close is deprecated Please use Application.quit');
        return this._close(force);
    }

    /**
     * Retrieves an array of wrapped fin.Windows for each of the application’s child windows.
     * @return {Promise.Array.<_Window>}
     * @tutorial Application.getChildWindows
     */
    public getChildWindows(): Promise<Array<_Window>> {
        return this.wire.sendAction('get-child-windows', this.identity)
            .then(({ payload }) => {
                const identityList: Array<Identity> = [];
                payload.data.forEach((winName: string) => {
                    identityList.push({uuid: this.identity.uuid, name: winName});
                });
                return this.windowListFromIdentityList(identityList);
            });
    }

    /**
     * Retrieves an array of active window groups for all of the application's windows. Each group is
     * represented as an array of wrapped fin.Windows.
     * @return {Promise.Array.Array.<_Window>}
     * @tutorial Application.getGroups
     */
    public getGroups(): Promise<Array<Array<_Window>>> {
        const winGroups: Array<Array<_Window>> = <Array<Array<_Window>>>[];
        return this.wire.sendAction('get-application-groups', Object.assign({}, this.identity, {
                crossApp: true // cross app group supported
            })).then(({ payload }) => {
                payload.data.forEach((windowList: any[], index: number) => {
                    const identityList: Array<Identity> = [];
                    windowList.forEach(winInfo => {
                        identityList.push({uuid: winInfo.uuid, name: winInfo.windowName});
                    });
                    winGroups[index] = this.windowListFromIdentityList(identityList);
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
     * @return {Promise.<ShortCutConfig>}
     * @tutorial Application.getShortcuts
     */
    public getShortcuts(): Promise<ShortCutConfig> {
        return this.wire.sendAction('get-shortcuts', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Returns the current zoom level of the application.
     * @return {Promise.<number>}
     * @tutorial Application.getZoomLevel
     */
    public getZoomLevel(): Promise<number> {
        return this.wire.sendAction('get-application-zoom-level', this.identity).then(({ payload }) => payload.data);
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

    public run(): Promise<void> {
        console.warn('Deprecation Warning: Application.run is deprecated Please use fin.Application.start');
        return this._run();
    }
    // tslint:disable-next-line:function-name
    private _run(): Promise<void> {
        return this.wire.sendAction('run-application', Object.assign({}, this.identity, {
            manifestUrl: this._manifestUrl
        })).then(() => undefined);
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
     * Sends a message to the RVM to upload the application's logs. On success,
     * an object containing logId is returned.
     * @return {Promise.<any>}
     * @tutorial Application.sendApplicationLog
     */
    public async sendApplicationLog(): Promise<LogInfo> {
        const { payload } = await this.wire.sendAction('send-application-log', this.identity);
        return payload.data;
    }

    /**
     * Adds a customizable icon in the system tray.  To listen for a click on the icon use the `tray-icon-clicked` event.
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
     * @param { ShortCutConfig } config New application's shortcut configuration.
     * @param { boolean } [config.desktop] - Enable/disable desktop shortcut.
     * @param { boolean } [config.startMenu] - Enable/disable start menu shortcut.
     * @param { boolean } [config.systemStartup] - Enable/disable system startup shortcut.
     * @return {Promise.<void>}
     * @tutorial Application.setShortcuts
     */
    public setShortcuts(config: ShortCutConfig): Promise<void> {
        return this.wire.sendAction('set-shortcuts', Object.assign({}, this.identity, {data: config})
               ).then(() => undefined);
    }

    /**
     * Sets the zoom level of the application. The original size is 0 and each increment above or below represents zooming 20%
     * larger or smaller to default limits of 300% and 50% of original size, respectively.
     * @param { number } level The zoom level
     * @return {Promise.<void>}
     * @tutorial Application.setZoomLevel
     */
    public setZoomLevel(level: number): Promise<void> {
        return this.wire.sendAction('set-application-zoom-level', Object.assign({}, this.identity, { level })).then(() => undefined);
    }

    /**
     * Sets a username to correlate with App Log Management.
     * @param { string } username Username to correlate with App's Log.
     * @return {Promise.<void>}
     * @tutorial Application.setAppLogUsername
     */
    public async setAppLogUsername(username: string): Promise<void> {
        await this.wire.sendAction('set-app-log-username', Object.assign({data: username}, this.identity));
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
     * @return {Promise.<ApplicationInfo>}
     * @tutorial Application.getInfo
     */
    public getInfo(): Promise<ApplicationInfo> {
        return this.wire.sendAction('get-info', this.identity).then(({ payload }) => payload.data);
    }

}
