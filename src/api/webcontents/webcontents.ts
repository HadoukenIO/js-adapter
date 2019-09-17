import { EmitterBase } from '../base';
import { Identity } from '../../identity';
import Transport from '../../transport/transport';
import { WebContentsEventMapping } from '../events/webcontents';

export class WebContents<T extends WebContentsEventMapping> extends EmitterBase<T> {
    constructor(wire: Transport, identity: Identity, public entityType: string) {
        super(wire, [entityType, identity.uuid, identity.name]);
    }
    public executeJavaScript(code: string): Promise<void> {
        return this.wire.sendAction('execute-javascript-in-window', Object.assign({}, this.identity, { code }))
            .then(() => undefined);
    }

    public getZoomLevel(): Promise<number> {
        return this.wire.sendAction('get-zoom-level', this.identity).then(({ payload }) => payload.data);
    }

    public setZoomLevel(level: number): Promise<void> {
        return this.wire.sendAction('set-zoom-level', Object.assign({}, this.identity, { level })).then(() => undefined);
    }

    public navigate(url: string): Promise<void> {
        return this.wire.sendAction('navigate-window', Object.assign({}, this.identity, { url })).then(() => undefined);
    }

    public navigateBack(): Promise<void> {
        return this.wire.sendAction('navigate-window-back', Object.assign({}, this.identity)).then(() => undefined);
    }

    public async navigateForward(): Promise<void> {
        await this.wire.sendAction('navigate-window-forward', Object.assign({}, this.identity));
    }

    public stopNavigation(): Promise<void> {
        return this.wire.sendAction('stop-window-navigation', Object.assign({}, this.identity)).then(() => undefined);
    }

    public reload(ignoreCache: boolean = false): Promise<void> {
        return this.wire.sendAction('reload-window', Object.assign({}, {
            ignoreCache
        }, this.identity)).then(() => undefined);
    }
}