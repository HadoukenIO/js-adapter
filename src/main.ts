import Fin from "./api/fin"
import Transport from "./transport/transport"
import WebSocketTransport from "./transport/websocket"
import { AppIdentity } from "./identity"

/** Connect to an OpenFin Runtime */
export function connect(address: string, uuid: string, name?: string): Promise<Fin> {
    const wire = new Transport(WebSocketTransport),
        me = new AppIdentity(uuid, name)
    return wire.connect(address, me)
        .then(token => new Fin(wire, token))
}

export { Identity } from "./identity"