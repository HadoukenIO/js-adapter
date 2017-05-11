import Fin from './api/fin';
import { Application } from './api/application/application';
import { _Window as Window } from './api/window/window';
import System from './api/system/system';

import {default as Transport, ConnectConfig} from './transport/transport';
import WebSocketTransport from './transport/websocket';

// Connect to an OpenFin Runtime
export function connect(config: ConnectConfig): Promise<Fin> {
    const wire = new Transport(WebSocketTransport);
    return wire.connect(config)
        .then(token => new Fin(wire, token));
}

export { Identity } from './identity'
export { Fin, Application, Window, System };
