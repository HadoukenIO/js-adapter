import Fin from './api/fin';
import { Application } from './api/application/application';
import { _Window as Window } from './api/window/window';
import System from './api/system/system';

import {default as Transport, ConnectConfig} from './transport/transport';
import WebSocketTransport from './transport/websocket';

/**
  This function connect is takes the arguement connect
  takes a object is modeled by the interface connectConfig.
  This function uses the connect to create a new instance of
  the imported class Transport. Transpaort takes WebSocketTransport
  as its argument and returns a promise, this promise
  then creates a new instance of the fin class instance
  which takes the token parameter from the promise and wire
  @params { string }: config
*/
// Connect to an OpenFin Runtime
export function connect(config: ConnectConfig): Promise<Fin> {
    const wire = new Transport(WebSocketTransport);
    return wire.connect(config)
        .then(token => new Fin(wire, token));
}

export { Identity } from './identity'
export { Fin, Application, Window, System };
