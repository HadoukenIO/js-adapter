import { AnchorType, Transition, TransitionOptions } from '../../shapes';
import { Base, EmitterBase } from '../base';
import { ExternalWindowEvents } from '../events/externalWindow';
import { ExternalWindowIdentity } from '../../identity';
import Bounds from './bounds';
import Transport from '../../transport/transport';

 /**
  * @lends ExternalWindow
  */
export default class ExternalWindowModule extends Base {
    /**
     * Asynchronously returns an external window object that represents
     * an existing external window.
     * @param { ExternalWindowIdentity } identity
     * @return {Promise.<ExternalWindow>}
     * @tutorial ExternalWindow.wrap
     * @static
     */
    public async wrap(identity: ExternalWindowIdentity): Promise<ExternalWindow> {
        return new ExternalWindow(this.wire, identity);
    }

    /**
     * Synchronously returns an external window object that represents an
     * existing external window.
     * @param { ExternalWindowIdentity } identity
     * @return {ExternalWindow}
     * @tutorial ExternalWindow.wrapSync
     * @static
     */
    public wrapSync(identity: ExternalWindowIdentity): ExternalWindow {
        return new ExternalWindow(this.wire, identity);
    }
}

export class ExternalWindow extends EmitterBase<ExternalWindowEvents> {
    constructor(wire: Transport, public identity: ExternalWindowIdentity) {
        super(wire, ['external-window', identity.nativeId]);
    }

    /**
     * Performs the specified external window transitions.
     * @param {Transition} transitions - Describes the animations to perform. See the tutorial.
     * @param {TransitionOptions} options - Options for the animation. See the tutorial.
     * @return {Promise.<void>}
     * @tutorial Window.animate
     */
    public animate(transitions: Transition, options: TransitionOptions): Promise<void> {
        return this.wire.sendAction('animate-external-window', Object.assign({}, this.identity, {
            transitions,
            options
        })).then(({ payload }) => payload.data);
    }

    /**
     * Brings the external window to the front of the window stack.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.bringToFront
     */
    public bringToFront(): Promise<void> {
        return this.wire.sendAction('bring-external-window-to-front', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Closes the external window.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.close
    */
    public close(): Promise<void> {
        return this.wire.sendAction('close-external-window', this.identity)
            .then(() => {
                Object.setPrototypeOf(this, null);
                return undefined;
            });
    }

    /**
     * Prevents a user from changing an external window's size/position
     * when using the window's frame.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.disableUserMovement
     */
    public disableUserMovement(): Promise<void> {
        return this.wire.sendAction('disable-external-window-frame', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Re-enables user changes to an external window's size/position
     * when using the window's frame.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.enableUserMovement
     */
    public enableUserMovement(): Promise<void> {
        return this.wire.sendAction('enable-externa-window-frame', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Flashes the external window’s frame and taskbar icon until stopFlashing is called.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.flash
     */
    public flash(): Promise<void> {
        return this.wire.sendAction('flash-external-window', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Gives focus to the external window.
     * @return {Promise.<void>}
     * @emits ExternalWindow#focused
     * @tutorial ExternalWindow.focus
     */
    public focus(): Promise<void> {
        return this.wire.sendAction('focus-external-window', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Gets the current bounds (top, left, etc.) of the external window.
     * @return {Promise.<Bounds>}
     * @tutorial ExternalWindow.getBounds
    */
    public getBounds(): Promise<Bounds> {
        return this.wire.sendAction('get-external-window-bounds', this.identity)
            // tslint:disable-next-line
            .then(({ payload }) => payload.data as Bounds);
    }

    /**
     * Retrieves an array containing wrapped external windows that are grouped
     * with this external window. If a window is not in a group an empty array
     * is returned.
     * @return {Promise.<Array<ExternalWindow>>}
     * @tutorial ExternalWindow.getGroup
     */
    public getGroup(): Promise<Array<ExternalWindow>> {
        return this.wire.sendAction('get-external-window-group', this.identity)
            .then(({ payload }) => {
                // tslint:disable-next-line
                let winGroup: Array<ExternalWindow> = [] as Array<ExternalWindow>;

                if (payload.data.length) {
                    winGroup = payload.data.map((identity: ExternalWindowIdentity) => {
                        const { nativeId } = identity;
                        return new ExternalWindow(this.wire, { nativeId });
                    });
                }

                return winGroup;
        });
    }

    /**
     * Gets the current settings of the external window.
     * @return {Promise.<any>}
     * @tutorial ExternalWindow.getOptions
     */
    public getOptions(): Promise<any> {
        return this.wire.sendAction('get-external-window-options', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Gets the current state ("minimized", "maximized", or "restored") of
     * the external window.
     * @return {Promise.<string>}
     * @tutorial ExternalWindow.getState
     */
    public getState(): Promise<string> {
        return this.wire.sendAction('get-external-window-state', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Hides the external window.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.hide
     */
    public hide(): Promise<void> {
        return this.wire.sendAction('hide-external-window', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Determines if the external window is currently showing.
     * @return {Promise.<boolean>}
     * @tutorial ExternalWindow.isShowing
     */
    public isShowing(): Promise<boolean> {
        return this.wire.sendAction('is-external-window-showing', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Joins the same window group as the specified window.
     * @param { class } target The window whose group is to be joined
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.joinGroup
     */
    public joinGroup(target: ExternalWindow): Promise<void> {
        return this.wire.sendAction('join-external-window-group', Object.assign({}, this.identity, {
            // groupingHwnd: target.identity.name, // TODO: fix this to use external window identity
            groupingPid: target.identity.nativeId // TODO: fix this to use external window identity
        })).then(({ payload }) => payload.data);
    }

    /**
     * Leaves the current window group so that the window can be moved
     * independently of those in the group.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.leaveGroup
     */
    public leaveGroup(): Promise<void> {
        return this.wire.sendAction('leave-external-window-group', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Maximizes the external window.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.maximize
     */
    public maximize(): Promise<void> {
        return this.wire.sendAction('maximize-external-window', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Merges the instance's external window group with the same window group
     * as the specified window.
     * @param { class } target The window whose group is to be merged with
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.mergeGroups
     */
    public mergeGroups(target: ExternalWindow): Promise<void> {
        return this.wire.sendAction('merge-external-window-groups', Object.assign({}, this.identity, {
            // groupingWindowName: target.identity.name // TODO: fix this to use external window identity
            groupingUuid: target.identity.nativeId // TODO: fix this to use external window identity
        })).then(({ payload }) => payload.data);
    }

    /**
     * Minimizes the external window.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.minimize
     */
    public minimize(): Promise<void> {
        return this.wire.sendAction('minimize-external-window', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Moves the external window by a specified amount.
     * @param { number } deltaLeft The change in the left position of the window
     * @param { number } deltaTop The change in the top position of the window
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.moveBy
     */
    public moveBy(deltaLeft: number, deltaTop: number): Promise<void> {
        return this.wire.sendAction('move-external-window-by', Object.assign({}, this.identity, { deltaLeft, deltaTop }))
            .then(() => undefined);
    }

    /**
     * Moves the external window to a specified location.
     * @param { number } left The left position of the window
     * @param { number } top The top position of the window
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.moveTo
     */
    public moveTo(left: number, top: number): Promise<void> {
        return this.wire.sendAction('move-external-window', Object.assign({}, this.identity, { left, top }))
            .then(() => undefined);
    }

    /**
     * Resizes the external window by a specified amount.
     * @param { number } deltaWidth The change in the width of the window
     * @param { number } deltaHeight The change in the height of the window
     * @param { AnchorType } anchor Specifies a corner to remain fixed during the resize.
     * Can take the values: "top-left", "top-right", "bottom-left", or "bottom-right".
     * If undefined, the default is "top-left".
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.resizeBy
     */
    public resizeBy(deltaWidth: number, deltaHeight: number, anchor: AnchorType): Promise<void> {
        return this.wire.sendAction('resize-external-window-by', Object.assign({}, this.identity, {
            deltaWidth: Math.floor(deltaWidth),
            deltaHeight: Math.floor(deltaHeight),
            anchor
        })).then(({ payload }) => payload.data);
    }

    /**
     * Resizes the external window to the specified dimensions.
     * @param { number } width The change in the width of the window
     * @param { number } height The change in the height of the window
     * @param { AnchorType } anchor Specifies a corner to remain fixed during the resize.
     * Can take the values: "top-left", "top-right", "bottom-left", or "bottom-right".
     * If undefined, the default is "top-left".
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.resizeTo
     */
    public resizeTo(width: number, height: number, anchor: AnchorType): Promise<void> {
        return this.wire.sendAction('resize-external-window', Object.assign({}, this.identity, {
            width: Math.floor(width),
            height: Math.floor(height),
            anchor
        })).then(({ payload }) => payload.data);
    }

    /**
     * Restores the external window to its normal state (i.e. unminimized, unmaximized).
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.restore
     */
    public restore(): Promise<void> {
        return this.wire.sendAction('restore-external-window', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Will bring the external window to the front of the entire stack and
     * give it focus.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.setAsForeground
     */
    public setAsForeground(): Promise<void> {
        return this.wire.sendAction('set-foreground-external-window', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Sets the external window's size and position.
     * @property { Bounds } bounds
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.setBounds
     */
    public setBounds(bounds: Bounds): Promise<void> {
        return this.wire.sendAction('set-external-window-bounds', Object.assign({}, this.identity, bounds))
            .then(({ payload }) => payload.data);
    }

    /**
     * Shows the external window if it is hidden.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.show
     */
    public show(): Promise<void> {
        return this.wire.sendAction('show-external-window', this.identity)
            .then(({ payload }) => payload.data);
    }

    /**
     * Shows the external window, if it is hidden, at the specified location.
     * If the toggle parameter is set to true, the external window will
     * alternate between showing and hiding.
     * @param { number } left The left position of the window
     * @param { number } top The top position of the window
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.showAt
     */
    public showAt(left: number, top: number): Promise<void> {
        return this.wire.sendAction('show-at-window', Object.assign({}, this.identity, {
            left: Math.floor(left),
            top: Math.floor(top)
        })).then(({ payload }) => payload.data);
    }

    /**
     * Stops the taskbar icon from flashing.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.stopFlashing
     */
    public stopFlashing(): Promise<void> {
        return this.wire.sendAction('stop-flash-external-window', this.identity)
            .then(({ payload }) => payload.data);
    }
}
