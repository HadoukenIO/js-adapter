import { OpenFinAPI } from "./api/index"
import Transport from "./transport"
import { Identity } from "./identity"

/** Connect to an OpenFin Runtime */
export function connect(address: string, uuid: string): Promise<OpenFinAPI> {
    return new Promise((resolve, reject) => {
        const wire = new Transport()
        wire.connect(address)
            .then(() => wire.authenticate(new Identity(uuid))
                .then(token => resolve(new OpenFinAPI(wire, token)))
                .catch(reject)
            )
            .catch(reject)
    })
}

export { Identity } from "./identity"