import Fin from './api/fin';
import { Application } from './api/application/application';
import { _Window as Window } from './api/window/window';
import { _Frame as Frame } from './api/frame/frame';
import System from './api/system/system';
import { ConnectConfig } from './transport/wire';
import { default as NodeEnvironment } from './environment/node-env';

import { default as Transport } from './transport/transport';
import WebSocketTransport from './transport/websocket';

const environment = new NodeEnvironment();
// Connect to an OpenFin Runtime
export function connect(config: ConnectConfig): Promise<Fin> {
    const wire: Transport = new Transport(WebSocketTransport, environment);
    return wire.connect(config)
        .then(token => new Fin(wire, token));
}

export { Identity } from './identity'
export { Fin, Application, Window, System , Frame};
