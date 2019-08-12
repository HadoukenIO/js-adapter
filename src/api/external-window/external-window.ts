import { _Window } from '../window/window';
import { AnchorType, Bounds } from '../../shapes';
import { Base, EmitterBase } from '../base';
import { ExternalWindowEvents } from '../events/externalWindow';
import { GroupWindowIdentity, Identity } from '../../identity';
import Transport from '../../transport/transport';

/**
 * @lends ExternalWindow
 */
export default class ExternalWindowModule extends Base {
    /**
     * Asynchronously returns an external window object that represents
     * an existing external window.<br>
     * Note: This method is restricted by default and must be enabled via
     * <a href="https://developers.openfin.co/docs/api-security">API security settings</a>.
     * @param { Identity } identity
     * @return {Promise.<ExternalWindow>}
     * @static
     * @experimental
     * @tutorial Window.wrap
     */
    public async wrap(identity: Identity): Promise<ExternalWindow> {
        await this.wire.sendAction('register-native-external-window', identity);
        return new ExternalWindow(this.wire, identity);
    }

    /**
     * Synchronously returns an external window object that represents an
     * existing external window.
     * This method is intended for debugging / experimentation only and should not be
     * used in production. It will not handle errors gracefully in cases such as an attempt
     * to wrap a non-existent window.
     * Use `ExternalWindow.wrap` instead.
     * @param { Identity } identity
     * @return {ExternalWindow}
     * @static
     * @experimental
     * @tutorial Window.wrapSync
     */
    public wrapSync(identity: Identity): ExternalWindow {
        console.warn('ExternalWindow.wrapSync is only intended for debugging and may not handle errors properly.'
            + '\nUse ExternalWindow.wrap instead.');
        this.wire.sendAction('register-native-external-window', identity);
        return new ExternalWindow(this.wire, identity);
    }
}

/**
 * @classdesc An ExternalWindow is an OpenFin object representing a window that belongs to a non-openfin application.<br>
 * While External Windows don't have the complete functionality of an OpenFin Window object,
 * they can be used to tap into any application that is currently running in the OS.<br>
 * External Windows are useful for grouping, moving and resizing non-openfin applications
 * as well as listening to events that are dispatched by these applications.<br>
 * They are also compatible with OpenFin's Layouts service to facilitate
 * a complete positional control over all running applications.<br>
 * External Windows has the ability to listen for <a href="tutorial-ExternalWindow.EventEmitter.html"> external window specific events</a>.
 * @class
 * @alias ExternalWindow
 * @hideconstructor
 */
export class ExternalWindow extends EmitterBase<ExternalWindowEvents> {
    constructor(wire: Transport, public identity: Identity) {
        super(wire, ['external-window', identity.uuid]);
        this.topic = 'external-window';
    }

    /**
     * Brings the external window to the front of the window stack.
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.bringToFront
     */
    public async bringToFront(): Promise<void> {
        await this.wire.sendAction('bring-external-window-to-front', this.identity);
    }

    /**
     * Closes the external window.
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.close
    */
    public async close(): Promise<void> {
        await this.wire.sendAction('close-external-window', this.identity);
        Object.setPrototypeOf(this, null);
    }

    /**
     * Prevents a user from changing an external window's size/position
     * when using the window's frame.
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.disableUserMovement
     */
    public async disableUserMovement(): Promise<void> {
        await this.wire.sendAction('disable-external-window-user-movement', this.identity);
    }

    /**
     * Re-enables user changes to an external window's size/position
     * when using the window's frame.
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.enableUserMovement
     */
    public async enableUserMovement(): Promise<void> {
        await this.wire.sendAction('enable-external-window-user-movement', this.identity);
    }

    /**
     * Flashes the external window’s frame and taskbar icon until stopFlashing is called.
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.flash
     */
    public async flash(): Promise<void> {
        await this.wire.sendAction('flash-external-window', this.identity);
    }

    /**
     * Gives focus to the external window.
     * @return {Promise.<void>}
     * @emits ExternalWindow#focused
     * @experimental
     * @tutorial Window.focus
     */
    public async focus(): Promise<void> {
        await this.wire.sendAction('focus-external-window', this.identity);
    }

    /**
     * Gets the current bounds (top, left, etc.) of the external window.
     * @return {Promise.<Bounds>}
     * @experimental
     * @tutorial Window.getBounds
    */
    public async getBounds(): Promise<Bounds> {
        const { payload: { data } } = await this.wire.sendAction('get-external-window-bounds', this.identity);
        return data;
    }

    /**
     * Retrieves an array containing wrapped external windows that are grouped
     * with this external window. If a window is not in a group an empty array
     * is returned.
     * @return {Promise.<Array<ExternalWindow|_Window>>}
     * @experimental
     * @tutorial Window.getGroup
     */
    public async getGroup(): Promise<Array<ExternalWindow | _Window>> {
        const { payload: { data } } = await this.wire.sendAction('get-external-window-group', this.identity);

        if (!data.length) {
            return [];
        }

        return data.map(({ uuid, name, isExternalWindow }: GroupWindowIdentity) => {
            if (isExternalWindow) {
                return new ExternalWindow(this.wire, { uuid });
            } else {
                return new _Window(this.wire, { uuid, name });
            }
        });
    }

    /**
     * Gets an information object for the window.
     * @return {Promise.<any>}
     * @experimental
     * @tutorial Window.getInfo
     */
    public async getInfo(): Promise<any> {
        const { payload: { data } } = await this.wire.sendAction('get-external-window-info', this.identity);
        return data;
    }

    /**
     * Gets an external window's options.
     * @return {Promise.<any>}
     * @experimental
     * @tutorial Window.getOptions
     */
    public async getOptions(): Promise<any> {
        const { payload: { data } } = await this.wire.sendAction('get-external-window-options', this.identity);
        return data;
    }

    /**
     * Gets the current state ("minimized", "maximized", or "restored") of
     * the external window.
     * @return {Promise.<string>}
     * @experimental
     * @tutorial Window.getState
     */
    public async getState(): Promise<string> {
        const { payload: { data } } = await this.wire.sendAction('get-external-window-state', this.identity);
        return data;
    }

    /**
     * Hides the external window.
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.hide
     */
    public async hide(): Promise<void> {
        await this.wire.sendAction('hide-external-window', this.identity);
    }

    /**
     * Determines if the external window is currently showing.
     * @return {Promise.<boolean>}
     * @experimental
     * @tutorial Window.isShowing
     */
    public async isShowing(): Promise<boolean> {
        const { payload: { data } } = await this.wire.sendAction('is-external-window-showing', this.identity);
        return data;
    }

    /**
     * Joins the same window group as the specified window.
     * @param { _Window | ExternalWindow } target The window whose group is to be joined
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.joinGroup
     */
    public async joinGroup(target: ExternalWindow | _Window): Promise<void> {
        const { identity: { uuid, name } } = target;
        const targetIdentity = { groupingUuid: uuid, groupingWindowName: name };
        const payload = { ...this.identity, ...targetIdentity };
        await this.wire.sendAction('join-external-window-group', payload);
    }

    /**
     * Leaves the current window group so that the window can be moved
     * independently of those in the group.
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.leaveGroup
     */
    public async leaveGroup(): Promise<void> {
        await this.wire.sendAction('leave-external-window-group', this.identity);
    }

    /**
     * Maximizes the external window.
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.maximize
     */
    public async maximize(): Promise<void> {
        await this.wire.sendAction('maximize-external-window', this.identity);
    }

    /**
     * Merges the instance's window group with the same window group as the specified window
     * @param { _Window | ExternalWindow } target The window whose group is to be merged with
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.mergeGroups
     */
    public async mergeGroups(target: ExternalWindow | _Window): Promise<void> {
        const { identity: { uuid, name } } = target;
        const targetIdentity = { groupingUuid: uuid, groupingWindowName: name };
        const payload = { ...this.identity, ...targetIdentity };
        await this.wire.sendAction('merge-external-window-groups', payload);
    }

    /**
     * Minimizes the external window.
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.minimize
     */
    public async minimize(): Promise<void> {
        await this.wire.sendAction('minimize-external-window', this.identity);
    }

    /**
     * Moves the external window by a specified amount.
     * @param { number } deltaLeft The change in the left position of the window
     * @param { number } deltaTop The change in the top position of the window
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.moveBy
     */
    public async moveBy(deltaLeft: number, deltaTop: number): Promise<void> {
        const payload = { ...this.identity, deltaLeft, deltaTop };
        await this.wire.sendAction('move-external-window-by', payload);
    }

    /**
     * Moves the external window to a specified location.
     * @param { number } left The left position of the window
     * @param { number } top The top position of the window
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.moveTo
     */
    public async moveTo(left: number, top: number): Promise<void> {
        const payload = { ...this.identity, left, top };
        await this.wire.sendAction('move-external-window', payload);
    }

    /**
     * Resizes the external window by a specified amount.
     * @param { number } deltaWidth The change in the width of the window
     * @param { number } deltaHeight The change in the height of the window
     * @param { AnchorType } anchor Specifies a corner to remain fixed during the resize.
     * Can take the values: "top-left", "top-right", "bottom-left", or "bottom-right".
     * If undefined, the default is "top-left".
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.resizeBy
     */
    public async resizeBy(deltaWidth: number, deltaHeight: number, anchor: AnchorType): Promise<void> {
        const payload = {
            ...this.identity,
            anchor,
            deltaHeight: Math.floor(deltaHeight),
            deltaWidth: Math.floor(deltaWidth)
        };
        await this.wire.sendAction('resize-external-window-by', payload);
    }

    /**
     * Resizes the external window to the specified dimensions.
     * @param { number } width The change in the width of the window
     * @param { number } height The change in the height of the window
     * @param { AnchorType } anchor Specifies a corner to remain fixed during the resize.
     * Can take the values: "top-left", "top-right", "bottom-left", or "bottom-right".
     * If undefined, the default is "top-left".
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.resizeTo
     */
    public async resizeTo(width: number, height: number, anchor: AnchorType): Promise<void> {
        const payload = {
            ...this.identity,
            anchor,
            height: Math.floor(height),
            width: Math.floor(width)
        };
        await this.wire.sendAction('resize-external-window', payload);
    }

    /**
     * Restores the external window to its normal state (i.e. unminimized, unmaximized).
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.restore
     */
    public async restore(): Promise<void> {
        await this.wire.sendAction('restore-external-window', this.identity);
    }

    /**
     * Will bring the external window to the front of the entire stack and
     * give it focus.
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.setAsForeground
     */
    public async setAsForeground(): Promise<void> {
        await this.wire.sendAction('set-external-window-as-foreground', this.identity);
    }

    /**
     * Sets the external window's size and position.
     * @property { Bounds } bounds
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.setBounds
     */
    public async setBounds(bounds: Bounds): Promise<void> {
        const payload = { ...this.identity, ...bounds };
        await this.wire.sendAction('set-external-window-bounds', payload);
    }

    /**
     * Shows the external window if it is hidden.
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.show
     */
    public async show(): Promise<void> {
        await this.wire.sendAction('show-external-window', this.identity);
    }

    /**
     * Shows the external window, if it is hidden, at the specified location.
     * If the toggle parameter is set to true, the external window will
     * alternate between showing and hiding.
     * @param { number } left The left position of the window
     * @param { number } top The top position of the window
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.showAt
     */
    public async showAt(left: number, top: number): Promise<void> {
        const payload = {
            ...this.identity,
            left: Math.floor(left),
            top: Math.floor(top)
        };
        await this.wire.sendAction('show-external-window-at', payload);
    }

    /**
     * Stops the taskbar icon from flashing.
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.stopFlashing
     */
    public async stopFlashing(): Promise<void> {
        await this.wire.sendAction('stop-external-window-flashing', this.identity);
    }

    /**
     * Updates the external window using the passed options
     * @param {*} options Changes an external window's options
     * @return {Promise.<void>}
     * @experimental
     * @tutorial Window.updateOptions
     */
    public async updateOptions(options: any): Promise<void> {
        const payload = { ...this.identity, options };
        await this.wire.sendAction('update-external-window-options', payload);
    }
}
