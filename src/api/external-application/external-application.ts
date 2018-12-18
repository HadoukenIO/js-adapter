import { Base, EmitterBase } from '../base';
import { Identity } from '../../identity';
import Transport from '../../transport/transport';
import { ExternalApplicationEvents } from '../events/externalApplication';

export interface ExternalApplicationInfo {
    parent: Identity;
}

 /**
  * @lends ExternalApplication
  */
export default class ExternalApplicationModule extends Base {
    /**
     * Asynchronously returns an External Application object that represents an existing external application.
     * @param {string} uuid The UUID of the external application to be wrapped
     * @return {Promise.<ExternalApplication>}
     * @tutorial ExternalApplication.wrap
     * @static
     */
    public wrap(uuid: string): Promise<ExternalApplication> {
        return Promise.resolve(new ExternalApplication(this.wire, {uuid}));
    }

    /**
     * Synchronously returns an External Application object that represents an existing external application.
     * @param {string} uuid The UUID of the external application to be wrapped
     * @return {ExternalApplication}
     * @tutorial ExternalApplication.wrapSync
     * @static
     */
    public wrapSync(uuid: string): ExternalApplication {
        return new ExternalApplication(this.wire, {uuid});
    }
}

/**
 * @classdesc An ExternalApplication object representing an application. Allows
 * the developer to create, execute, show and close an external application as
 * well as listen to application events.
 * @class
 */
export class ExternalApplication extends EmitterBase<ExternalApplicationEvents> {

    constructor(wire: Transport, public identity: Identity) {
        super(wire, ['external-application', identity.uuid]);
    }

    /**
     * Adds the listener function to the end of the listeners array for the specified event type.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - Called whenever an event of the specified type occurs.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @method
     * @tutorial ExternalApplication.addEventListener
     */
    public addListener = super.addListener;

    /**
     * Adds the listener function to the end of the listeners array for the specified event type.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - Called whenever an event of the specified type occurs.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @method
     * @tutorial ExternalApplication.addEventListener
     */
    public on = super.on;

    /**
     * Adds a one-time listener function for the specified event type.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - The callback function.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @method
     * @tutorial ExternalApplication.addEventListener
     */
    public once = super.once;

    /**
     * Adds the listener function to the beginning of the listeners array for the specified event type.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - The callback function.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @method
     * @tutorial ExternalApplication.addEventListener
     */
    public prependListener = super.prependListener;

    /**
     * Adds a one-time listener function for the specified event type to the beginning of the listeners array.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - The callback function.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @method
     * @tutorial ExternalApplication.addEventListener
     */
    public prependOnceListener = super.prependOnceListener;

    /**
     * Removes the specified listener from the listener array for the specified event type.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - The callback function.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @method
     * @tutorial ExternalApplication.removeListener
     */
    public removeListener = super.removeListener;

    /**
     * Removes all listeners, or those of the specified event type.
     * @param { string | symbol } eventType  - The type of the event.
     * @return {Promise.<this>}
     * @method
     * @tutorial ExternalApplication.removeAllListeners
     */
    public removeAllListeners = super.removeAllListeners;

    /**
     * Retrieves information about the external application.
     * @return {Promise.<ExternalApplicationInfo>}
     * @tutorial ExternalApplication.getInfo
     */
    public getInfo(): Promise<ExternalApplicationInfo> {
        return this.wire.sendAction('get-external-application-info', this.identity).then(({ payload }) => payload.data);
    }
}
