import { Bare, Base, RuntimeEvent } from '../base';
import { Identity } from '../../identity';
import Bounds from './bounds';
import BoundsChangedReply from './bounds-changed';
import Animation from './animation';
import { Application } from '../application/application';
import Transport from '../../transport/transport';

// tslint:disable-next-line
export default class _WindowModule extends Bare {
    public wrap(identity: Identity): _Window {
        return new _Window(this.wire, identity);
    }
}

export interface CloseEventShape {
    name: string;
    uuid: string;
    type: string;
    topic: string;
}

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
export class _Window extends Base {

    constructor(wire: Transport, public identity: Identity) {
        super(wire);

        this.on('removeListener', eventType => {
            this.deregisterEventListener(Object.assign({}, this.identity, {
                type: eventType,
                topic : this.topic
            }));
        });

        this.on('newListener', eventType => {
            this.registerEventListener(Object.assign({}, this.identity, {
                type: eventType,
                topic : this.topic
            }));
        });
    }

    protected runtimeEventComparator = (listener: RuntimeEvent): boolean => {
        return listener.topic === this.topic && listener.uuid === this.identity.uuid &&
            listener.name === this.identity.name;
    }

    private windowListFromNameList(nameList: Array<string>): Array<_Window> {
        const windowList: Array<_Window> = [];

        // tslint:disable-next-line
        for (let i = 0; i < nameList.length; i++) {
            windowList.push(new _Window(this.wire, {
                // tslint:disable-next-line
                uuid: this.identity.uuid as string,
                name: nameList[i]
            }));
        }
        return windowList;
    }

    /**
     * Gets the current bounds (top, left, width, height) of the window.
     * @return {Promise.<Bounds>}
    */
    public getBounds(): Promise<Bounds> {
        return this.wire.sendAction('get-window-bounds', this.identity)
        // tslint:disable-next-line
            .then(({ payload }) => payload.data as Bounds);
    }

    /**
     * Gives focus to the window.
     * @return {Promise.<void>}
     */
    public focus(): Promise<void> {
        return this.wire.sendAction('focus-window', this.identity).then(() => undefined);
    }

    /**
     * Removes focus from the window.
     * @return {Promise.<void>}
     */
    public blur(): Promise<void> {
        return this.wire.sendAction('blur-window', this.identity).then(() => undefined);
    }

    /**
     * Brings the window to the front of the window stack.
     * @return {Promise.<void>}
     */
    public bringToFront(): Promise<void> {
        return this.wire.sendAction('bring-window-to-front', this.identity).then(() => undefined);
    }

    /**
     * Closes the window
     * @param { boolean } interrupt assigns the value to flase
     * @return {Animation}
     */
    public animationBuilder(interrupt: boolean = false): Animation {
        return new Animation(this.wire, this.identity, interrupt);
    }

    /**
     * Hides the window.
     * @return {Promise.<void>}
     */
    public hide(): Promise<void> {
        return this.wire.sendAction('hide-window', this.identity).then(() => undefined);
    }

    /**
     * closes the window application
     * @param { boolean } force A boolean that is assign to flase
     * @return {Promise.<void>}
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
     */
    public getNativeId(): Promise<string> {
        return this.wire.sendAction('get-window-native-id', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Prevents a user from changing a window's size/position when using the window's frame.
     * @return {Promise.<void>}
     */
    public disableFrame(): Promise<void> {
        return this.wire.sendAction('disable-window-frame', this.identity).then(() => undefined);
    }

    /**
     * Re-enables user changes to a window's size/position when using the window's frame.
     * @return {Promise.<void>}
     */
    public enableFrame(): Promise<void> {
        return this.wire.sendAction('enable-window-frame', this.identity).then(() => undefined);
    }

    /**
     * Executes Javascript on the window, restricted to windows you own or windows owned by
     * applications you have created.
     * @param { string } code JavaScript code to be executed on the window.
     * @return {Promise.<void>}
     */
    public executeJavaScript(code: string): Promise<void> {
        return this.wire.sendAction('execute-javascript-in-window', Object.assign({}, this.identity, { code }))
            .then(() => undefined);
    }

    /**
     * Flashes the window’s frame and taskbar icon until stopFlashing is called.
     * @return {Promise.<void>}
     */
    public flash(): Promise<void> {
        return this.wire.sendAction('flash-window', this.identity).then(() => undefined);
    }

    /**
     * Stops the taskbar icon from flashing.
     * @return {Promise.<void>}
     */
    public stopFlashing(): Promise<void> {
        return this.wire.sendAction('stop-flash-window', this.identity).then(() => undefined);
    }

    /**
     * Retrieves an array containing wrapped fin.desktop.Windows that are grouped with this
     * window. If a window is not in a group an empty array is returned. Please note that
     * calling window is included in the result array.
     * @return {Promise.Array.Array.<_Window>}
     */
    public getGroup(): Promise<Array<Array<_Window>>> {
        return this.wire.sendAction('get-window-group', this.identity).then(({ payload }) => {
            // tslint:disable-next-line
            let winGroups: Array<Array<_Window>> = [] as Array<Array<_Window>>;
            // tslint:disable-next-line
            for (let i = 0; i < payload.data.length; i++) {
                winGroups[i] = this.windowListFromNameList(payload.data[i]);
            }

            return winGroups;
        });
    }

    /**
     * Gets the current settings of the window.
     * @return {Promise.<any>}
     */
    public getOptions(): Promise<any> {
        return this.wire.sendAction('get-window-options', this.identity).then(({ payload }) => payload.data);
    }

    /**
     * Gets the parent application.
     * @return {Promise.<Application>}
     */
    public getParentApplication(): Promise<Application> {
        return Promise.resolve(new Application(this.wire, this.identity));
    }

    /**
     * Gets the parent window.
     * @return {Promise.<_Window>}
     */
    public getParentWindow(): Promise<_Window> {
        return Promise.resolve(new Application(this.wire, this.identity)).then(app => app.getWindow());
    }

    /**
     * Gets a base64 encoded PNG snapshot of the window.
     * @return {Promise.<string>}
     */
    public getSnapshot(): Promise<string> {
        return this.wire.sendAction('get-window-snapshot', this.identity).then(({ payload }) => payload.data);
    }

    /**
     * Gets the current state ("minimized", "maximized", or "restored") of the window.
     * @return {Promise.<string>}
     */
    public getState(): Promise<string> {
        return this.wire.sendAction('get-window-state', this.identity).then(({ payload }) => payload.data);
    }

    /**
     * Determines if the window is currently showing.
     * @return {Promise.<boolean>}
     */
    public isShowing(): Promise<boolean> {
        return this.wire.sendAction('is-window-showing', this.identity).then(({ payload }) => payload.data);
    }

    /**
     * Joins the same window group as the specified window.
     * @param { class } target The window whose group is to be joined
     * @return {Promise.<void>}
     */
    public joinGroup(target: _Window): Promise<void> {
        return this.wire.sendAction('join-window-group', Object.assign({}, this.identity, {
            groupingUuid: target.identity.uuid,
            groupingWindowName: target.identity.name
        })).then(() => undefined);
    }

    /**
     * Leaves the current window group so that the window can be move independently of those in the group.
     * @return {Promise.<void>}
     */
    public leaveGroup(): Promise<void> {
        return this.wire.sendAction('leave-window-group', this.identity).then(() => undefined);
    }

    /**
     * Maximizes the window
     * @return {Promise.<void>}
     */
    public maximize(): Promise<void> {
        return this.wire.sendAction('maximize-window', this.identity).then(() => undefined);
    }

    /**
     * Merges the instance's window group with the same window group as the specified window
     * @param { class } target The window whose group is to be merged with
     * @return {Promise.<void>}
     */
    public mergeGroups(target: _Window): Promise<void> {
        return this.wire.sendAction('join-window-group', Object.assign({}, this.identity, {
            groupingUuid: target.identity.uuid,
            groupingWindowName: target.identity.name
        })).then(() => undefined);
    }

    /**
     * Minimizes the window.
     * @return {Promise.<void>}
     */
    public minimize(): Promise<void> {
        return this.wire.sendAction('minimize-window', this.identity).then(() => undefined);
    }

    /**
     * Moves the window by a specified amount.
     * @param { number } deltaLeft The change in the left position of the window
     * @param { number } deltaTop The change in the top position of the window
     * @tutorial Window.moveBy
     * @return {Promise.<void>}
     */
    public moveBy(deltaLeft: number, deltaTop: number): Promise<void> {
        return this.wire.sendAction('move-window-by', Object.assign({}, this.identity, { deltaLeft, deltaTop })).then(() => undefined);
    }

    /**
     * Moves the window to a specified location.
     * @param { number } left The left position of the window
     * @param { number } top The top position of the window
     * @tutorial Window.moveTo
     * @return {Promise.<void>}
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
     * @tutorial Window.resizeBy
     * @return {Promise.<void>}
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
     * @tutorial Window.resizeTo
     * @return {Promise.<void>}
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
     * @tutorial Window.restore
     * @return {Promise.<void>}
     */
    public restore(): Promise<void> {
        return this.wire.sendAction('restore-window', this.identity).then(() => undefined);
    }

    /**
     * Will bring the window to the front of the entire stack and give it focus.
     * @tutorial Window.setAsForeground
     * @return {Promise.<void>}
     */
    public setAsForeground(): Promise<void> {
        return this.wire.sendAction('set-foreground-window', this.identity).then(() => undefined);
    }

    /**
     * Sets the window's size and position.
     * @param { Bounds } bounds This is a object that holds the properties of
     * @tutorial Window.setBounds
     * @return {Promise.<void>}
     */
    public setBounds(bounds: Bounds): Promise<void> {
        return this.wire.sendAction('set-window-bounds', Object.assign({}, this.identity, bounds)).then(() => undefined);
    }

    /**
     * Shows the window if it is hidden.
     * @param { boolean } force assign the value to flase
     * @tutorial Window.show
     * @return {Promise.<void>}
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
     * @tutorial Window.showAt
     * @return {Promise.<void>}
     */
    public showAt(left: number, top: number, force: boolean = false): Promise<void> {
        return this.wire.sendAction('show-at-window', Object.assign({}, this.identity, {
            force,
            left: Math.floor(left),
            top: Math.floor(top)
        })).then(() => undefined);
    }

    /**
     * Updates the window using the passed options
     * @param {*} options Changes a window's options that were defined upon creation. See tutorial
     * @return {Promise.<void>}
     */
    public updateOptions(options: any): Promise<void> {
        return this.wire.sendAction('show-window', Object.assign({}, this.identity, { options })).then(() => undefined);
    }

    /**
     * Provides credentials to authentication requests
     * @param { string } userName userName to provide to the authentication challange
     * @param { string } password password to provide to the authentication challange
     * @return {Promise.<void>}
     */
    public authenticate(userName: string, password: string): Promise<void> {
        return this.wire.sendAction('window-authenticate', Object.assign({}, this.identity, { userName, password })).then(() => undefined);
    }

    /**
     * Returns the zoom level of the window.
     * @tutorial Window.getZoomLevel
     * @return {Promise.<number>}
     */
    public getZoomLevel(): Promise<number> {
        return this.wire.sendAction('get-zoom-level', this.identity).then(({ payload }) => payload.data);
    }

    /**
     * Sets the zoom level of the window.
     * @param { number } level The zoom level
     * @tutorial Window.setZoomLevel
     * @return {Promise.<void>}
     */
    public setZoomLevel(level: number): Promise<void> {
        return this.wire.sendAction('set-zoom-level', Object.assign({}, this.identity, { level })).then(() => undefined);
    }

}

// tslint:disable-next-line
export interface _Window {
    on(type: 'focused', listener: Function): this;
    on(type: 'bounds-changed', listener: (data: BoundsChangedReply) => void): this;
    on(type: 'hidden', listener: Function): this;
    on(type: 'removeListener', listener: (eventType: string) => void): this;
    on(type: 'newListener', listener: (eventType: string) => void): this;
    on(type: 'closed', listener: (eventType: CloseEventShape) => void): this;
}
