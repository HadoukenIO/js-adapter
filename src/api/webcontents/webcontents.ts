import { EmitterBase } from '../base';
import { BaseEventMap } from '../events/base';
import { Identity } from '../../identity';
import Transport from '../../transport/transport';

export class WebContents<T extends BaseEventMap> extends EmitterBase<T> {
    constructor(wire: Transport, identity: Identity, public entityType: string) {
        super(wire, [entityType, identity.uuid, identity.name]);
    }
    public executeJavaScript(code: string): Promise<void> {
        return this.wire.sendAction('execute-javascript-in-window', Object.assign({}, this.identity, { code }))
            .then(() => undefined);
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
     * Navigates the window to a specified URL. The url must contain the protocol prefix such as http:// or https://.
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
     * Navigates the window forward one page.
     * @return {Promise.<void>}
     * @tutorial Window.navigateForward
     */
    public async navigateForward(): Promise<void> {
        await this.wire.sendAction('navigate-window-forward', Object.assign({}, this.identity));
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