import { Fin } from "./api/fin"
import Transport from "./transport/transport"
import { Identity } from "./identity"

/** Connect to an OpenFin Runtime */
export function connect(address: string, uuid: string): Promise<Fin> {
    const wire = new Transport
    return wire.connect(address)
        .then(() => wire.authenticate(new Identity(uuid)))
        .then(token => new Fin(wire, token))
}

export { Identity } from "./identity"