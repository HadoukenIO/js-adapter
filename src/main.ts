import Promise = require("bluebird")
import { OpenFinAPI } from "./api/index"
import Transport from "./transport"

/** Connect to an OpenFin Runtime */
export function connect(address: string, uuid: string): Promise<OpenFinAPI> {
    return new Promise((resolve, reject) => {
        const wire = new Transport()
        wire.connect(address)
            .then(() => wire.authenticate(uuid)
                .then(token => resolve(new OpenFinAPI(wire, token)))
                .catch(reject)
            )
            .catch(reject)
    })
}