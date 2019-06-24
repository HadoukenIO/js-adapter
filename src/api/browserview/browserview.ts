import { WebContents } from '../webcontents/webcontents';
import { BaseEventMap } from '../events/base';
import Transport from '../../transport/transport';
import { Identity } from '../../identity';
import { Base } from '../base';
interface AutoResizeOptions {
    /**
     * If true, the view's width will grow and shrink together with the window. false
     * by default.
     */
    width: boolean;
    /**
     * If true, the view's height will grow and shrink together with the window. false
     * by default.
     */
    height: boolean;
}
export interface BrowserViewOptions {
    autoResize?: AutoResizeOptions;
}
export interface BrowserViewCreationOptions extends BrowserViewOptions {
    name: string;
    url: string;
    target: Identity;
    bounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

export class BrowserViewModule extends Base {
    public async create(options: BrowserViewCreationOptions) {
        const uuid = this.wire.me.uuid;
        await this.wire.sendAction('create-browser-view' , {...options, uuid});
        return this.wrapSync({uuid, name: options.name});
    }
    public wrapSync(identity: Identity) {
        return new BrowserView(this.wire, identity);
    }
}

export class BrowserView extends WebContents<BaseEventMap> {
    constructor(wire: Transport, public identity: Identity) {
        super(wire, identity, 'browserview');
    }
    // public attach = async (target: Identity) => {
    //     await this.wire.sendAction('attach-browser-view', {target, ...this.identity})
    // }
    public setBounds = async (bounds: any) => {
        await this.wire.sendAction('set-browser-view-bounds', {bounds, ...this.identity});
    }
    public getInfo = async () => {
        const ack = await this.wire.sendAction('get-browser-view-info', {...this.identity});
        return ack.payload.data;
    }

}