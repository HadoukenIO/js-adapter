import { Base, EmitterBase } from '../base';
import { Identity } from '../../identity';
import Transport from '../../transport/transport';
import { FrameEvents } from '../events/frame';

export type EntityType = 'window' | 'iframe' | 'external connection' | 'unknown';

export interface FrameInfo {
    uuid: string;
    name: string;
    entityType: EntityType;
    parent: Identity;
}

/**
 * @lends Frame
 */
// tslint:disable-next-line
export default class _FrameModule extends Base {
    /**
     * Asynchronously returns a reference to the specified frame. The frame does not have to exist
     * @param {Identity} identity - the identity of the frame you want to wrap
     * @return {Promise.<_Frame>}
     * @tutorial Frame.wrap
     * @static
     */
    public wrap(identity: Identity): Promise<_Frame> {
        return Promise.resolve(new _Frame(this.wire, identity));
    }

    /**
     * Synchronously returns a reference to the specified frame. The frame does not have to exist
     * @param {Identity} identity - the identity of the frame you want to wrap
     * @return {_Frame}
     * @tutorial Frame.wrapSync
     * @static
     */
    public wrapSync(identity: Identity): _Frame {
        return new _Frame(this.wire, identity);
    }

    /**
     * Asynchronously returns a reference to the current frame
     * @return {Promise.<_Frame>}
     * @tutorial Frame.getCurrent
     * @static
     */
    public getCurrent(): Promise<_Frame> {
        return Promise.resolve(new _Frame(this.wire, this.me));
    }

    /**
     * Synchronously returns a reference to the current frame
     * @return {_Frame}
     * @tutorial Frame.getCurrentSync
     * @static
     */
    public getCurrentSync(): _Frame {
        return new _Frame(this.wire, this.me);
    }
}

/**
 * @classdesc Represents a way to interact with `iframes`. Facilitates discovery of current context
 * (iframe or main window) as well as the ability to listen for frame-specific events.
 * @class
 * @alias Frame
 */
// tslint:disable-next-line
export class _Frame extends EmitterBase<FrameEvents> {

    constructor(wire: Transport, public identity: Identity) {
        super(wire, ['frame', identity.uuid, identity.name]);
    }

    /**
     * Returns a frame info object for the represented frame
     * @return {Promise.<FrameInfo>}
     * @tutorial Frame.getInfo
     */
    public getInfo(): Promise<FrameInfo> {
        return this.wire.sendAction('get-frame-info', this.identity).then(({ payload }) => payload.data);
    }

    /**
     * Returns a frame info object representing the window that the referenced iframe is
     * currently embedded in
     * @return {Promise.<FrameInfo>}
     * @tutorial Frame.getParentWindow
     */
    public getParentWindow(): Promise<FrameInfo> {
        return this.wire.sendAction('get-parent-window', this.identity).then(({ payload }) => payload.data);
    }

}
