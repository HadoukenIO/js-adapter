import { EmitterBase } from '../base';
import { ExternalWindowEvents } from '../events/externalWindow';
import Transport from '../../transport/transport';

 /**
  * @lends ExternalWindow
  */
export default class ExternalWindowModule extends EmitterBase<ExternalWindowEvents> {
    constructor(wire: Transport) {
        super(wire, ['external-window']);
        this.topic = 'external-window';
    }

    public wrap(): string {
        return 'roma';
    }
}
