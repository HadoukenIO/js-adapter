import Fin from "./api/fin";
import {default as Transport, ConnectConfig} from "./transport/transport";
import WebSocketTransport from "./transport/websocket";

/** Connect to an OpenFin Runtime */
export function connect(config: ConnectConfig): Promise<Fin> {
    const wire = new Transport(WebSocketTransport);
    return wire.connect(config)
        .then(token => new Fin(wire, token));
}

export { Identity } from "./identity"
