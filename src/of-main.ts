import Fin from './api/fin';
import { Application } from './api/application/application';
import { _Window as Window } from './api/window/window';
import System from './api/system/system';

import {default as Transport, ConnectConfig} from './transport/transport';
import ElIPCTransport from './transport/elipc';

export function connect(config: ConnectConfig): Promise<Fin> {
    const wire = new Transport(ElIPCTransport);
    return wire.connect(config)
        .then(token => new Fin(wire, token)); //Token is not used by fin.
}

declare var window: any;
window.RicardoConnect = connect;

export { Identity } from './identity'
export { Fin, Application, Window, System };
