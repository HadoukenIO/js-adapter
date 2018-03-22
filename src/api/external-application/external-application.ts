import { Bare, Base, Reply } from '../base';
import { Identity } from '../../identity';
import Transport from '../../transport/transport';

export interface ExternalApplicationInfo {
    parent: Identity;
}

export default class ExternalApplicationModule extends Bare {
    /**
     * Returns an External Application object that represents an existing external application.
     * @param {string} uuid The UUID of the external application to be wrapped
     * @return {Promise.<ExternalApplication>}
     */
    public wrap(uuid: string): Promise<ExternalApplication> {
        return Promise.resolve(new ExternalApplication(this.wire, {uuid}));
    }
}

/**
 * @classdesc An ExternalApplication object representing an application. Allows
 * the developer to create, execute, show and close an external application as
 * well as listen to application events.
 * @class
 */
export class ExternalApplication extends Base {

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

    /**
     * Retrieves information about the external application.
     * @return {Promise.<ExternalApplicationInfo>}
     * @tutorial ExternalApplication.getInfo
     */
    public getInfo(): Promise<ExternalApplicationInfo> {
        return this.wire.sendAction<ExternalApplicationInfo>('get-external-application-info', this.identity)
            .then(({ payload }) => payload.data);
    }
}

export interface ExternalApplication {
    on(type: 'connected', listener: (data: Reply<'externalapplication', 'connected'>) => void): this;
    on(type: 'disconnected', listener: (data: Reply<'externalapplication', 'disconnected'>) => void): this;
    on(type: 'removeListener', listener: (eventType: string) => void): this;
    on(type: 'newListener', listener: (eventType: string) => void): this;
}
