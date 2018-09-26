import { Base, EmitterBase } from '../base';
import { Identity } from '../../identity';
import Bounds from './bounds';
import { Transition, TransitionOptions } from './transition';
import { Application } from '../application/application';
import Transport from '../../transport/transport';
import { notImplementedEnvErrorMsg } from '../../environment/environment';
import { WindowEvents } from '../events/window';

/**
 * @lends Window
 */
// tslint:disable-next-line
export default class _WindowModule extends Base {
    /**
     * Asynchronously returns a Window object that represents an existing window.
     * @param { Identity } identity
     * @return {Promise.<_Window>}
     * @tutorial Window.wrap
     * @static
     */
    public async wrap(identity: Identity): Promise<_Window> {
        return new _Window(this.wire, identity);
    }

    /**
     * Synchronously returns a Window object that represents an existing window.
     * @param { Identity } identity
     * @return {_Window}
     * @tutorial Window.wrapSync
     * @static
     */
    public wrapSync(identity: Identity): _Window {
        return new _Window(this.wire, identity);
    }

    /**
     * Creates a new Window.
     * @param { * } options - Window creation options
     * @return {Promise.<_Window>}
     * @tutorial Window.create
     * @static
     */
    public create(options: any): Promise<_Window> {
       const win = new _Window(this.wire, {uuid: this.me.uuid, name: options.name});
       return win.createWindow(options);
    }

    /**
     * Asynchronously returns a Window object that represents the current window
     * @return {Promise.<_Window>}
     * @tutorial Window.getCurrent
     * @static
     */
    public getCurrent(): Promise<_Window> {
        return this.wrap(this.wire.me);
    }

    /**
     * Synchronously returns a Window object that represents the current window
     * @return {_Window}
     * @tutorial Window.getCurrentSync
     * @static
     */
    public getCurrentSync(): _Window {
        return this.wrapSync(this.wire.me);
    }
}

export interface CloseEventShape {
    name: string;
    uuid: string;
    type: string;
    topic: string;
}

export interface WindowInfo {
    canNavigateBack: boolean;
    canNavigateForward: boolean;
    preloadScripts: Array<any>;
    title: string;
    url: string;
}

export interface FrameInfo {
    name: string;
    uuid: string;
    entityType: string;
    parent?: Identity;
}

export interface Area {
    height: number;
    width: number;
    x: number;
    y: number;
}

/**
 * @typedef { Object } Area
 * @property { number } height Area's height
 * @property { number } width Area's width
 * @property { number } x X coordinate of area's starting point
 * @property { number } y Y coordinate of area's starting point
 */

/**
 * @typedef {object} Transition
 * @property {Opacity} opacity - The Opacity transition
 * @property {Position} position - The Position transition
 * @property {Size} size - The Size transition
*/

/**
 * @typedef {object} TransitionOptions
 * @property {boolean} interrupt - This option interrupts the current animation. When false it pushes
this animation onto the end of the animation queue.
 * @property {boolean} relative - Treat 'opacity' as absolute or as a delta. Defaults to false.
 */

/**
 * @typedef {object} Size
 * @property {number} duration - The total time in milliseconds this transition should take.
 * @property {boolean} relative - Treat 'opacity' as absolute or as a delta. Defaults to false.
 * @property {number} width - Optional if height is present. Defaults to the window's current width.
 * @property {number} height - Optional if width is present. Defaults to the window's current height.
 */

/**
 * @typedef {object} Position
 * @property {number} duration - The total time in milliseconds this transition should take.
 * @property {boolean} relative - Treat 'opacity' as absolute or as a delta. Defaults to false.
 * @property {number} left - Defaults to the window's current left position in virtual screen coordinates.
 * @property {number} top - Defaults to the window's current top position in virtual screen coordinates.
 */

/**
 * @typedef {object} Opacity
 * @property {number} duration - The total time in milliseconds this transition should take.
 * @property {boolean} relative - Treat 'opacity' as absolute or as a delta. Defaults to false.
 * @property {number} opacity - This value is clamped from 0.0 to 1.0.
*/

/**
 * Bounds is a interface that has the properties of height,
 * width, left, top which are all numbers
 * @typedef { Object } Bounds
 * @property { number } height Get the application height bound
 * @property { number } width Get the application width bound
 * @property { number } top Get the application top bound
 * @property { number } left Get the application left bound
 * @property { number } right Get the application right bound
 * @property { number } bottom Get the application bottom bound
 */

/**
 * @classdesc A basic window that wraps a native HTML window. Provides more fine-grained
 * control over the window state such as the ability to minimize, maximize, restore, etc.
 * By default a window does not show upon instantiation; instead the window's show() method
 * must be invoked manually. The new window appears in the same process as the parent window.
 * @class
 * @alias Window
*/
// The window.Window name is taken
// tslint:disable-next-line
export class _Window extends EmitterBase<WindowEvents> {
    /**
     * Raised when a window within this application requires credentials from the user.
     *
     * @event Window#auth-requested
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     * @property {object} authInfo
     * @property {string} authInfo.host - Host server.
     * @property {boolean} authInfo.isProxy - Indicates if the request involves a proxy.
     * @property {number} authInfo.port - Port number.
     * @property {string} authInfo.realm - Authentication request realm.
     * @property {string} authInfo.scheme - Authentication scheme.
     */

    /**
     * Raised when a window loses focus.
     *
     * @event Window#blurred
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     */

    /**
     * Raised after changes in a window's size and/or position.
     *
     * @event Window#bounds-changed
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     * @property {number} changeType - Describes what kind of change occurred.
     0 means a change in position.
     1 means a change in size.
     2 means a change in position and size.
     * @property {string} deferred - Indicated whether pending changes have been applied.
     * @property {number} height - New height of the window.
     * @property {number} left - New left most coordinate of the window.
     * @property {number} top - New top most coordinate of the window.
     * @property {number} width - New width of the window.
     */

    /**
     * Raised when a window has been prevented from closing. A window will be prevented from closing by default,
     either through the API or by a user when ‘close-requested’ has been subscribed to and the Window.close(force) flag is false.
     *
     * @event Window#close-requested
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     */

    /**
     * Raised when a window has closed.
     *
     * @event Window#closed
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     */

    /**
     * Raised when a window has crashed.
     *
     * @event Window#crashed
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     */

    /**
     * Raised when the frame is disabled after all prevent user changes in window's size and/or position have completed.
     *
     * @event Window#disabled-frame-bounds-changed
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     * @property {number} changeType - Describes what kind of change occurred.
     0 means a change in position.
     1 means a change in size.
     2 means a change in position and size.
     * @property {string} deferred - Indicated whether pending changes have been applied.
     * @property {number} height - New height of the window.
     * @property {number} left - New left most coordinate of the window.
     * @property {number} top - New top most coordinate of the window.
     * @property {number} width - New width of the window.
     */

    /**
     * Raised when the frame is disabled during prevented user changes to a window's size and/or position.
     *
     * @event Window#disabled-frame-bounds-changing
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     * @property {number} changeType - Describes what kind of change occurred.
     0 means a change in position.
     1 means a change in size.
     2 means a change in position and size.
     * @property {string} deferred - Indicated whether pending changes have been applied.
     * @property {number} height - New height of the window.
     * @property {number} left - New left most coordinate of the window.
     * @property {number} top - New top most coordinate of the window.
     * @property {number} width - New width of the window.
     */

    /**
     * Raised when the window has been embedded.
     *
     * @event Window#embedded
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     */

    /**
     * Raised when an external process has exited.
     *
     * @event Window#external-process-exited
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     * @property {string} processUuid - The process handle UUID.
     * @property {number} exitCode - The process exit code
     */

    /**
     * Raised when an external process has started.
     *
     * @event Window#external-process-started
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     * @property {string} processUuid - The process handle UUID.
     */

    /**
     * Raised when a window's frame becomes disabled.
     *
     * @event Window#frame-disabled
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     */

    /**
     * Raised when a window's frame becomes enabled.
     *
     * @event Window#frame-enabled
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     */

    /**
     * Raised when a window joins/leaves a group and/or when the group a window is a member of changes.
     *
     * @event Window#group-changed
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     * @property {string} source - Which group array the window that the event listener was registered on is included in:
     'source' The window is included in sourceGroup.
     'target' The window is included in targetGroup.
     'nothing' The window is not included in sourceGroup nor targetGroup.
     * @property {string} reason - The reason this event was triggered.
     'leave' A window has left the group due to a leave or merge with group.
     'join' A window has joined the group.
     'merge' Two groups have been merged together.
     'disband' There are no other windows in the group.
     * @property {string} name - Name of the window.
     * @property {legacyWindowIdentity[]} sourceGroup - All the windows in the group the sourceWindow originated from.
     * @property {string} sourceWindowAppUuid - UUID of the application the sourceWindow belongs to the
     source window is the window in which (merge/join/leave)group(s) was called.
     * @property {string} sourceWindowName - Name of the sourcewindow.
     The source window is the window in which (merge/join/leave)group(s) was called.
     * @property {legacyWindowIdentity[]} targetGroup - All the windows in the group the targetWindow orginated from.
     * @property {string} targetWindowAppUuid - UUID of the application the targetWindow belongs to.
     The target window is the window that was passed into (merge/join)group(s).
     * @property {string} targetWindowName - Name of the targetWindow.
     The target window is the window that was passed into (merge/join)group(s).
     */

    /**
     * Raised when a window has been hidden.
     *
     * @event Window#hidden
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     * @property {string} reason - Action prompted the close The reasons are:
     "hide"
     "hide-on-close"
    */

    /**
     * Raised when a window is initialized.
     *
     * @event Window#initialized
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     */

    /**
     * Raised when a window is maximized.
     *
     * @event Window#maximized
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     */

    /**
     * Raised when a window is minimized.
     *
     * @event Window#minimized
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     */

    /**
     * Raised when window navigation is rejected as per ContentNavigation whitelist/blacklist rules.
     *
     * @event Window#navigation-rejected
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     * @property {string} sourceName - source of navigation window name.
     * @property {string} url - Blocked content url.
     */

    /**
     * Raised when a window is out of memory.
     *
     * @event Window#out-of-memory
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     */

    /**
     * Raised after the execution of all of a window's preload scripts. Contains
     information about all window's preload scripts' final states.
     *
     * @event Window#preload-scripts-state-changed
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     * @property {preloadScriptState[]} preloadState -  An array of all final preload scripts' states
     */

    /**
     * Raised during the execution of a window's preload script. Contains information
     about a single window's preload script's state, for which the event has been raised.
     *
     * @event Window#preload-scripts-state-changing
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     * @property {preloadScriptState[]} preloadState -  An array of all final preload scripts' states
     */

    /**
     * Raised when an HTTP load was cancelled or failed.
     *
     * @event Window#resource-load-failed
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     * @property {number} errorCode - The Chromium error code.
     * @property {string} errorDescription - The Chromium error description.
     * @property {string} validatedURL - The url attempted.
     * @property {boolean} isMainFrame - Was the attempt made from the main frame.
     */

    /**
     * Raised when an HTTP resource request has received response details.
     *
     * @event Window#resource-response-received
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     * @property {boolean} status - Status of the request.
     * @property {string} newUrl - The URL of the responded resource.
     * @property {string} originalUrl - The requested URL.
     * @property {number} httpResponseCode - The HTTP Response code.
     * @property {string} requestMethod - The HTTP request method.
     * @property {string} referrer - The HTTP referrer.
     * @property {object} headers - The HTTP headers.
     * @property {string} resourceType - Resource type:
     "mainFrame", "subFrame",
     "styleSheet", "script", "image",
     "object", "xhr", or "other"
    */

    /**
     * Raised when a window has reloaded.
     *
     * @event Window#reloaded
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     * @property {string} url - Url has has been reloaded.
     */

    /**
     * Raised when a window is displayed after having been minimized or
     when a window leaves the maximize state without minimizing.
     *
     * @event Window#restored
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     */

    /**
     * Raised when a window has been prevented from showing.
     A window will be prevented from showing by default, either through the API or by a user when
     ‘show-requested’ has been subscribed to on the window or 'window-show-requested'
     on the parent application and the Window.show(force) flag is false.
     *
     * @event Window#show-requested
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     */

    /**
     * Raised when a window been shown.
     *
     * @event Window#shown
     * @type {object}
     * @property {string} name - Name of the window.
     * @property {string} uuid - UUID of the application that the window belongs to.
     */

    /**
     * @typedef {object} legacyWindowIdentity
     * @summary Object summary
     * @desc Object description
     * @property {string} appUuid - The UUID of the application this window entry belongs to.
     * @property {string} windowName - The name of this window entry.
     */

    /**
     * @typedef {object} preloadScriptState
     * @summary Object summary
     * @desc Object description
     * @property {string} url - The url of the preload script.
     * @property {string} state - The preload script state:
     "load-failed", "failed", "succeeded"
     */

    private nativeWindow: any;

    constructor(wire: Transport, public identity: Identity) {
        super(wire, ['window', identity.uuid, identity.name]);

        // if it's openfin environment, need to add a native window to current window object
        if (this.isOpenFinEnvironment()) {
            if (this.wire.environment.isWindowExists(identity.uuid, identity.name)) {
                if (identity.name === window.name) {
                    this.nativeWindow = window;
                }
            }
        }
    }

    // create a new window
    public createWindow(options: any): Promise<_Window> {
        return new Promise((resolve, reject) => {
            const CONSTRUCTOR_CB_TOPIC = 'fire-constructor-callback';
            // need to call pageResponse, otherwise when a child window is created, page is not loaded
            const pageResponse = new Promise((resolve) => {
                // tslint:disable-next-line
                this.on(CONSTRUCTOR_CB_TOPIC, function fireConstructor(response: any) {
                    let cbPayload;
                    const success = response.success;
                    const responseData = response.data;
                    const message = responseData.message;

                    if (success) {
                        cbPayload = {
                            httpResponseCode: responseData.httpResponseCode,
                            apiInjected: responseData.apiInjected
                        };
                    } else {
                        cbPayload = {
                            message: responseData.message,
                            networkErrorCode: responseData.networkErrorCode,
                            stack: responseData.stack
                        };
                    }

                    this.removeListener(CONSTRUCTOR_CB_TOPIC, fireConstructor);
                    resolve({
                        message: message,
                        cbPayload: cbPayload,
                        success: success
                    });
                });
            });

            const windowCreation = this.wire.environment.createChildWindow(options);
            Promise.all([pageResponse, windowCreation]).then((resolvedArr: any[]) => {
                const pageResolve = resolvedArr[0];
                const childWin = resolvedArr[1];
                if (pageResolve.success) {
                    this.nativeWindow = childWin.nativeWindow;

                    //make sure we clean up all references when a window is closed.
                    this.on('closed', () => {
                        delete this.nativeWindow;
                    });
                    resolve(this);
                } else {
                    reject(pageResolve.message);
                }
            });
        });
    }

    private windowListFromNameList(identityList: Array<Identity>): Array<_Window> {
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
     * Retrieves an array of frame info objects representing the main frame and any
     * iframes that are currently on the page.
     * @return {Promise.<Array<FrameInfo>>}
     * @tutorial Window.getAllFrames
     */
    public getAllFrames(): Promise<Array<FrameInfo>> {
        return this.wire.sendAction('get-all-frames', this.identity).then(({ payload }) => payload.data);
    }

    /**
     * Gets the current bounds (top, left, width, height) of the window.
     * @return {Promise.<Bounds>}
     * @tutorial Window.getBounds
    */
    public getBounds(): Promise<Bounds> {
        return this.wire.sendAction('get-window-bounds', this.identity)
            // tslint:disable-next-line
            .then(({ payload }) => payload.data as Bounds);
    }

    /**
    * Returns the native JavaScript "window" object for the window.
    * @return {Promise.<any>}
    * @tutorial Window.getNativeWindow
    */
    public getNativeWindow(): Promise<any> {
        if (!this.isOpenFinEnvironment()) {
            throw new Error(notImplementedEnvErrorMsg);
        }
        return Promise.resolve(this.nativeWindow);
    }

    /**
     * Gives focus to the window.
     * @return {Promise.<void>}
     * @emits _Window#focused
     * @tutorial Window.focus
     */
    public focus(): Promise<void> {
        return this.wire.sendAction('focus-window', this.identity).then(() => undefined);
    }

    /**
     * Removes focus from the window.
     * @return {Promise.<void>}
     * @tutorial Window.blur
     */
    public blur(): Promise<void> {
        return this.wire.sendAction('blur-window', this.identity).then(() => undefined);
    }

    /**
     * Brings the window to the front of the window stack.
     * @return {Promise.<void>}
     * @tutorial Window.bringToFront
     */
    public bringToFront(): Promise<void> {
        return this.wire.sendAction('bring-window-to-front', this.identity).then(() => undefined);
    }

    /**
     * Performs the specified window transitions.
     * @param {Transition} transitions - Describes the animations to perform. See the tutorial.
     * @param {TransitionOptions} options - Options for the animation. See the tutorial.
     * @return {Promise.<void>}
     * @tutorial Window.animate
     */
    public animate(transitions: Transition, options: TransitionOptions ): Promise<void> {
        return this.wire.sendAction('animate-window', Object.assign({}, this.identity, {
           transitions,
           options
        })).then(() => undefined);
    }

    /**
     * Hides the window.
     * @return {Promise.<void>}
     * @tutorial Window.hide
     */
    public hide(): Promise<void> {
        return this.wire.sendAction('hide-window', this.identity).then(() => undefined);
    }

    /**
     * closes the window application
     * @param { boolean } [force = false] Close will be prevented from closing when force is false and
     *  ‘close-requested’ has been subscribed to for application’s main window.
     * @return {Promise.<void>}
     * @tutorial Window.close
    */
    public close(force: boolean = false): Promise<void> {
        return this.wire.sendAction('close-window', Object.assign({}, this.identity, { force }))
            .then(() => {
                Object.setPrototypeOf(this, null);
                return undefined;
            });
    }

    /**
     * Returns then running applications uuid
     * @return {Promise.<string>}
     * @tutorial Window.getNativeId
     */
    public getNativeId(): Promise<string> {
        return this.wire.sendAction('get-window-native-id', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Prevents a user from changing a window's size/position when using the window's frame.
     * @return {Promise.<void>}
     * @tutorial Window.disableFrame
     */
    public disableFrame(): Promise<void> {
        return this.wire.sendAction('disable-window-frame', this.identity).then(() => undefined);
    }

    /**
     * Re-enables user changes to a window's size/position when using the window's frame.
     * @return {Promise.<void>}
     * @tutorial Window.enableFrame
     */
    public enableFrame(): Promise<void> {
        return this.wire.sendAction('enable-window-frame', this.identity).then(() => undefined);
    }

    /**
     * Executes Javascript on the window, restricted to windows you own or windows owned by
     * applications you have created.
     * @param { string } code JavaScript code to be executed on the window.
     * @return {Promise.<void>}
     * @tutorial Window.executeJavaScript
     */
    public executeJavaScript(code: string): Promise<void> {
        return this.wire.sendAction('execute-javascript-in-window', Object.assign({}, this.identity, { code }))
            .then(() => undefined);
    }

    /**
     * Flashes the window’s frame and taskbar icon until stopFlashing is called.
     * @return {Promise.<void>}
     * @tutorial Window.flash
     */
    public flash(): Promise<void> {
        return this.wire.sendAction('flash-window', this.identity).then(() => undefined);
    }

    /**
     * Stops the taskbar icon from flashing.
     * @return {Promise.<void>}
     * @tutorial Window.stopFlashing
     */
    public stopFlashing(): Promise<void> {
        return this.wire.sendAction('stop-flash-window', this.identity).then(() => undefined);
    }

    /**
     * Retrieves an array containing wrapped fin.desktop.Windows that are grouped with this
     * window. If a window is not in a group an empty array is returned. Please note that
     * calling window is included in the result array.
     * @return {Promise.<Array<_Window>>}
     * @tutorial Window.getGroup
     */
    public getGroup(): Promise<Array<_Window>> {
        return this.wire.sendAction('get-window-group', Object.assign({}, this.identity, {
            crossApp: true // cross app group supported
        })).then(({ payload }) => {
            // tslint:disable-next-line
            let winGroup: Array<_Window> = [] as Array<_Window>;

            if (payload.data.length) {
                winGroup = this.windowListFromNameList(payload.data);
            }
            return winGroup;
        });
    }

    /**
     * Gets an information object for the window.
     * @return {Promise.<WindowInfo>}
     * @tutorial Window.getInfo
     */
    public getInfo():  Promise<WindowInfo> {
        return this.wire.sendAction('get-window-info', this.identity).then(({ payload }) => payload.data);
    }

    /**
     * Gets the current settings of the window.
     * @return {Promise.<any>}
     * @tutorial Window.getOptions
     */
    public getOptions(): Promise<any> {
        return this.wire.sendAction('get-window-options', this.identity).then(({ payload }) => payload.data);
    }

    /**
     * Gets the parent application.
     * @return {Promise.<Application>}
     * @tutorial Window.getParentApplication
     */
    public getParentApplication(): Promise<Application> {
        return Promise.resolve(new Application(this.wire, this.identity));
    }

    /**
     * Gets the parent window.
     * @return {Promise.<_Window>}
     * @tutorial Window.getParentWindow
     */
    public getParentWindow(): Promise<_Window> {
        return Promise.resolve(new Application(this.wire, this.identity)).then(app => app.getWindow());
    }

    /**
     * Gets a base64 encoded PNG snapshot of the window or just part a of it.
     * @param { Area } [area] The area of the window to be captured.
     * Omitting it will capture the whole visible window.
     * @return {Promise.<string>}
     * @tutorial Window.getSnapshot
     */
    public async getSnapshot(area?: Area): Promise<string> {
        const req = Object.assign({}, this.identity, { area });
        const res = await this.wire.sendAction('get-window-snapshot', req);
        return res.payload.data;
    }

    /**
     * Gets the current state ("minimized", "maximized", or "restored") of the window.
     * @return {Promise.<string>}
     * @tutorial Window.getState
     */
    public getState(): Promise<string> {
        return this.wire.sendAction('get-window-state', this.identity).then(({ payload }) => payload.data);
    }

    /**
     * Determines if the window is currently showing.
     * @return {Promise.<boolean>}
     * @tutorial Window.isShowing
     */
    public isShowing(): Promise<boolean> {
        return this.wire.sendAction('is-window-showing', this.identity).then(({ payload }) => payload.data);
    }

    /**
     * Joins the same window group as the specified window.
     * @param { class } target The window whose group is to be joined
     * @return {Promise.<void>}
     * @tutorial Window.joinGroup
     */
    public joinGroup(target: _Window): Promise<void> {
        return this.wire.sendAction('join-window-group', Object.assign({}, this.identity, {
            groupingUuid: target.identity.uuid,
            groupingWindowName: target.identity.name
        })).then(() => undefined);
    }

    /**
     * Reloads the window current page
     * @return {Promise.<void>}
     * @tutorial Window.reload
     */
    public reload(ignoreCache: boolean = false): Promise<void> {
        return this.wire.sendAction('reload-window', Object.assign({}, this.identity, {
            ignoreCache
        })).then(() => undefined);
    }

    /**
     * Leaves the current window group so that the window can be move independently of those in the group.
     * @return {Promise.<void>}
     * @tutorial Window.leaveGroup
     */
    public leaveGroup(): Promise<void> {
        return this.wire.sendAction('leave-window-group', this.identity).then(() => undefined);
    }

    /**
     * Maximizes the window
     * @return {Promise.<void>}
     * @tutorial Window.maximize
     */
    public maximize(): Promise<void> {
        return this.wire.sendAction('maximize-window', this.identity).then(() => undefined);
    }

    /**
     * Merges the instance's window group with the same window group as the specified window
     * @param { class } target The window whose group is to be merged with
     * @return {Promise.<void>}
     * @tutorial Window.mergeGroups
     */
    public mergeGroups(target: _Window): Promise<void> {
        return this.wire.sendAction('merge-window-groups', Object.assign({}, this.identity, {
            groupingUuid: target.identity.uuid,
            groupingWindowName: target.identity.name
        })).then(() => undefined);
    }

    /**
     * Minimizes the window.
     * @return {Promise.<void>}
     * @tutorial Window.minimize
     */
    public minimize(): Promise<void> {
        return this.wire.sendAction('minimize-window', this.identity).then(() => undefined);
    }

    /**
     * Moves the window by a specified amount.
     * @param { number } deltaLeft The change in the left position of the window
     * @param { number } deltaTop The change in the top position of the window
     * @return {Promise.<void>}
     * @tutorial Window.moveBy
     */
    public moveBy(deltaLeft: number, deltaTop: number): Promise<void> {
        return this.wire.sendAction('move-window-by', Object.assign({}, this.identity, { deltaLeft, deltaTop })).then(() => undefined);
    }

    /**
     * Moves the window to a specified location.
     * @param { number } left The left position of the window
     * @param { number } top The top position of the window
     * @return {Promise.<void>}
     * @tutorial Window.moveTo
     */
    public moveTo(left: number, top: number): Promise<void> {
        return this.wire.sendAction('move-window', Object.assign({}, this.identity, { left, top })).then(() => undefined);
    }

    /**
     * Resizes the window by a specified amount.
     * @param { number } deltaWidth The change in the width of the window
     * @param { number } deltaHeight The change in the height of the window
     * @param { string } anchor Specifies a corner to remain fixed during the resize.
     * Can take the values: "top-left", "top-right", "bottom-left", or "bottom-right."
     * If undefined, the default is "top-left"
     * @return {Promise.<void>}
     * @tutorial Window.resizeBy
     */
    public resizeBy(deltaWidth: number, deltaHeight: number, anchor: string): Promise<void> {
        return this.wire.sendAction('resize-window-by', Object.assign({}, this.identity, {
            deltaWidth: Math.floor(deltaWidth),
            deltaHeight: Math.floor(deltaHeight),
            anchor
        })).then(() => undefined);
    }

    /**
     * Resizes the window to the specified dimensions.
     * @param { number } width The change in the width of the window
     * @param { number } height The change in the height of the window
     * @param { string } anchor Specifies a corner to remain fixed during the resize.
     * Can take the values: "top-left", "top-right", "bottom-left", or "bottom-right."
     * If undefined, the default is "top-left"
     * @return {Promise.<void>}
     * @tutorial Window.resizeTo
     */
    public resizeTo(width: number, height: number, anchor: string): Promise<void> {
        return this.wire.sendAction('resize-window', Object.assign({}, this.identity, {
            width: Math.floor(width),
            height: Math.floor(height),
            anchor
        })).then(() => undefined);
    }

    /**
     * Restores the window to its normal state (i.e., unminimized, unmaximized).
     * @return {Promise.<void>}
     * @tutorial Window.restore
     */
    public restore(): Promise<void> {
        return this.wire.sendAction('restore-window', this.identity).then(() => undefined);
    }

    /**
     * Will bring the window to the front of the entire stack and give it focus.
     * @return {Promise.<void>}
     * @tutorial Window.setAsForeground
     */
    public setAsForeground(): Promise<void> {
        return this.wire.sendAction('set-foreground-window', this.identity).then(() => undefined);
    }

    /**
     * Sets the window's size and position.
     * @property { Bounds } bounds This is a * @type {string} name - name of the window.object that holds the propertys of
     * @return {Promise.<void>}
     * @tutorial Window.setBounds
     */
    public setBounds(bounds: Bounds): Promise<void> {
        return this.wire.sendAction('set-window-bounds', Object.assign({}, this.identity, bounds)).then(() => undefined);
    }

    /**
     * Shows the window if it is hidden.
     * @param { boolean } [force = false] Show will be prevented from showing when force is false and
     *  ‘show-requested’ has been subscribed to for application’s main window.
     * @return {Promise.<void>}
     * @tutorial Window.show
     */
    public show(force: boolean = false): Promise<void> {
        return this.wire.sendAction('show-window', Object.assign({}, this.identity, { force })).then(() => undefined);
    }

    /**
     * Shows the window if it is hidden at the specified location.
     * If the toggle parameter is set to true, the window will
     * alternate between showing and hiding.
     * @param { number } left The left position of the window
     * @param { number } top The right position of the window
     * @param { boolean } force Show will be prevented from closing when force is false and
     * ‘show-requested’ has been subscribed to for application’s main window
     * @return {Promise.<void>}
     * @tutorial Window.showAt
     */
    public showAt(left: number, top: number, force: boolean = false): Promise<void> {
        return this.wire.sendAction('show-at-window', Object.assign({}, this.identity, {
            force,
            left: Math.floor(left),
            top: Math.floor(top)
        })).then(() => undefined);
    }

    /**
     * Shows the Chromium Developer Tools
     * @return {Promise.<void>}
     * @tutorial Window.showDeveloperTools
     */
    public showDeveloperTools(): Promise<void> {
        return this.wire.sendAction('show-developer-tools', this.identity).then(() => undefined);
    }

    /**
     * Updates the window using the passed options
     * @param {*} options Changes a window's options that were defined upon creation. See tutorial
     * @return {Promise.<void>}
     * @tutorial Window.updateOptions
     */
    public updateOptions(options: any): Promise<void> {
        return this.wire.sendAction('update-window-options', Object.assign({}, this.identity, { options })).then(() => undefined);
    }

    /**
     * Provides credentials to authentication requests
     * @param { string } userName userName to provide to the authentication challange
     * @param { string } password password to provide to the authentication challange
     * @return {Promise.<void>}
     * @tutorial Window.authenticate
     */
    public authenticate(userName: string, password: string): Promise<void> {
        return this.wire.sendAction('window-authenticate', Object.assign({}, this.identity, { userName, password })).then(() => undefined);
    }

    /**
     * Returns the zoom level of the window.
     * @return {Promise.<number>}
     * @tutorial Window.getZoomLevel
     */
    public getZoomLevel(): Promise<number> {
        return this.wire.sendAction('get-zoom-level', this.identity).then(({ payload }) => payload.data);
    }

    /**
     * Sets the zoom level of the window.
     * @param { number } level The zoom level
     * @return {Promise.<void>}
     * @tutorial Window.setZoomLevel
     */
    public setZoomLevel(level: number): Promise<void> {
        return this.wire.sendAction('set-zoom-level', Object.assign({}, this.identity, { level })).then(() => undefined);
    }

    /**
     * Navigates the window to a specified URL.
     * @param {string} url - The URL to navigate the window to.
     * @return {Promise.<void>}
     * @tutorial Window.navigate
     */
    public navigate(url: string): Promise<void> {
        return this.wire.sendAction('navigate-window', Object.assign({}, this.identity, { url })).then(() => undefined);
    }

    /**
     * Navigates the window back one page.
     * @return {Promise.<void>}
     * @tutorial Window.navigateBack
     */
    public navigateBack(): Promise<void> {
        return this.wire.sendAction('navigate-window-back', Object.assign({}, this.identity)).then(() => undefined);
    }
    /**
     * Stops any current navigation the window is performing.
     * @return {Promise.<void>}
     * @tutorial Window.stopNavigation
     */
    public stopNavigation(): Promise<void> {
        return this.wire.sendAction('stop-window-navigation', Object.assign({}, this.identity)).then(() => undefined);
    }

}
