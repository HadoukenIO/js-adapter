import Promise = require("bluebird")
import OpenFinAPI from "./api"

export function connect(address: string, uuid: string): Promise<OpenFinAPI> {
    return Promise.resolve(new OpenFinAPI)
}