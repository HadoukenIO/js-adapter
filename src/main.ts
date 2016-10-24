import Fin from "./api/fin"
import Transport from "./transport/transport"
import WebSocketTransport from "./transport/websocket"
import { Identity } from "./identity"

/** Connect to an OpenFin Runtime */
export function connect(address: string, uuid: string): Promise<Fin> {
    const wire = new Transport(WebSocketTransport),
        you = new Identity(uuid)
    return wire.connect(address, you)
        .then(token => new Fin(wire, token, you))
}

export { Identity } from "./identity"