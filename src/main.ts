import { OpenFinAPI } from "./api/api"
import Transport from "./transport"
import { Identity } from "./identity"

/** Connect to an OpenFin Runtime */
export function connect(address: string, uuid: string): Promise<OpenFinAPI> {
    const wire = new Transport
    return wire.connect(address)
        .then(() => wire.authenticate(new Identity(uuid)))
        .then(token => new OpenFinAPI(wire, token))
}

export { Identity } from "./identity"