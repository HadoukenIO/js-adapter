import { Base, Reply } from '../base';
import { Identity } from '../../identity';

/**
 * @classdesc An ExternalApplication object representing an application. Allows
 * the developer to create, execute, show and close an external application as
 * well as listen to application events.
 * @class
 */
class ExternalApplication extends Base {
    public identity: Identity;

    /**
     * Returns an External Application object that represents an existing external application.
     * @param uuid The UUID of the external application to be wrapped
     * @return {ExternalApplication}
     */
    public wrap(uuid: string): ExternalApplication {
        const wrapped = new ExternalApplication(this.wire);
        wrapped.identity = { uuid };
        return wrapped;
    }
}

interface ExternalApplication {
    addEventListener(type: 'connected', listener: (data: Reply<'externalapplication', 'connected'>) => Promise<void>): this;
    addEventListener(type: 'disconnected', listener: (data: Reply<'externalapplication', 'disconnected'>) => Promise<void>): this;
}

export default ExternalApplication;
