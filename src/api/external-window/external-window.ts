import { Base, EmitterBase } from '../base';
import { ExternalWindowEvents } from '../events/externalWindow';
import { Identity } from '../../identity';
import Bounds from './bounds';
import Transport from '../../transport/transport';

 /**
  * @lends ExternalWindow
  */
export default class ExternalWindowModule extends Base {
    /**
     * Asynchronously returns an external window object that represents
     * an existing external window.
     * @param { Identity } identity
     * @return {Promise.<ExternalWindow>}
     * @tutorial ExternalWindow.wrap
     * @static
     */
    public async wrap(identity: Identity): Promise<ExternalWindow> { // TODO: fix this to use external window identity
        return new ExternalWindow(this.wire, identity);
    }

    /**
     * Synchronously returns an external window object that represents an
     * existing external window.
     * @param { Identity } identity
     * @return {ExternalWindow}
     * @tutorial ExternalWindow.wrapSync
     * @static
     */
    public wrapSync(identity: Identity): ExternalWindow { // TODO: fix this to use external window identity
        return new ExternalWindow(this.wire, identity);
    }
}

export class ExternalWindow extends EmitterBase<ExternalWindowEvents> {
    constructor(wire: Transport, public identity: Identity) { // TODO: fix this to use external window identity
        super(wire, ['external-window', identity.uuid]);
    }

    /**
     * Brings the external window to the front of the window stack.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.bringToFront
     */
    public bringToFront(): Promise<void> {
        return this.wire.sendAction('bring-external-window-to-front', this.identity).then(() => undefined);
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
                    winGroup = payload.data.map((identity: Identity) => { // TODO: fix this to use external window identity
                        const { uuid, name } = identity;
                        return new ExternalWindow(this.wire, { uuid, name });
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
        return this.wire.sendAction('get-external-window-options', this.identity).then(({ payload }) => payload.data);
    }

    /**
     * Hides the external window.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.hide
     */
    public hide(): Promise<void> {
        return this.wire.sendAction('hide-external-window', this.identity).then(() => undefined);
    }

    /**
     * Determines if the external window is currently showing.
     * @return {Promise.<boolean>}
     * @tutorial ExternalWindow.isShowing
     */
    public isShowing(): Promise<boolean> {
        return this.wire.sendAction('is-external-window-showing', this.identity).then(({ payload }) => payload.data);
    }

    /**
     * Joins the same window group as the specified window.
     * @param { class } target The window whose group is to be joined
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.joinGroup
     */
    public joinGroup(target: ExternalWindow): Promise<void> {
        return this.wire.sendAction('join-external-window-group', Object.assign({}, this.identity, {
            groupingHwnd: target.identity.name, // TODO: fix this to use external window identity
            groupingPid: target.identity.uuid // TODO: fix this to use external window identity
        })).then(() => undefined);
    }

    /**
     * Leaves the current window group so that the window can be moved
     * independently of those in the group.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.leaveGroup
     */
    public leaveGroup(): Promise<void> {
        return this.wire.sendAction('leave-external-window-group', this.identity).then(() => undefined);
    }

    /**
     * Maximizes the external window.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.maximize
     */
    public maximize(): Promise<void> {
        return this.wire.sendAction('maximize-external-window', this.identity).then(() => undefined);
    }

    /**
     * Minimizes the external window.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.minimize
     */
    public minimize(): Promise<void> {
        return this.wire.sendAction('minimize-external-window', this.identity).then(() => undefined);
    }

    /**
     * Restores the external window to its normal state (i.e. unminimized, unmaximized).
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.restore
     */
    public restore(): Promise<void> {
        return this.wire.sendAction('restore-external-window', this.identity).then(() => undefined);
    }

    /**
     * Sets the external window's size and position.
     * @property { Bounds } bounds
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.setBounds
     */
    public setBounds(bounds: Bounds): Promise<void> {
        return this.wire.sendAction('set-external-window-bounds', Object.assign({}, this.identity, bounds)).then(() => undefined);
    }

    /**
     * Shows the external window if it is hidden.
     * @return {Promise.<void>}
     * @tutorial ExternalWindow.show
     */
    public show(): Promise<void> {
        return this.wire.sendAction('show-external-window', this.identity).then(() => undefined);
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
        })).then(() => undefined);
    }
}
